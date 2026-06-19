import { getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'
import Stripe from 'stripe'
import type { Booking } from '@/payload-types'
import { createBookingCancelToken } from '@/utilities/bookingCancelToken'
import { toDateOnlyString } from '@/utilities/dateOnly'
import { sendBookingConfirmationEmail } from '@/utilities/sendBookingConfirmationEmail'
import { validateSlotOfferingForBooking } from '@/utilities/bookingSlotOffering'

function parseOptionalNumericId(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function stripeCurrencyToBookingCurrency(currency: string | undefined): 'GBP' {
  if (currency?.toLowerCase() === 'gbp') return 'GBP'
  return 'GBP'
}

export async function POST(request: Request): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json().catch(() => ({}))
  const {
    serviceId: bodyServiceId,
    guestEmail: bodyGuestEmail,
    guestName: bodyGuestName,
    slotDate: bodySlotDate,
    slotTime: bodySlotTime,
    slotOfferingId: bodySlotOfferingId,
    paymentIntentId,
  } = body

  let serviceId = bodyServiceId
  let guestEmail = bodyGuestEmail
  let guestName = bodyGuestName
  let slotDate = bodySlotDate
  let slotTime = bodySlotTime
  let slotOfferingId = parseOptionalNumericId(bodySlotOfferingId)

  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  let stripePaymentIntentId: string | undefined
  let paidAmountPence: number | undefined
  let paidCurrency: 'GBP' | undefined

  if (paymentIntentId && typeof paymentIntentId === 'string') {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'Stripe is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const stripe = new Stripe(secretKey)
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId).catch(() => null)
    if (!pi || pi.status !== 'succeeded') {
      return new Response(JSON.stringify({ error: 'Payment not completed or invalid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const meta = pi.metadata || {}
    if (meta.type !== 'booking') {
      return new Response(JSON.stringify({ error: 'Invalid payment for booking' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const mServiceId = meta.serviceId
    const mGuestEmail = meta.guestEmail
    const mSlotDate = meta.slotDate
    const mSlotTime = meta.slotTime
    const mGuestName = meta.guestName
    const metaSlotOfferingId = parseOptionalNumericId(meta.slotOfferingId)
    if (!mServiceId || !mGuestEmail || !mSlotDate || !mSlotTime) {
      return new Response(JSON.stringify({ error: 'Payment metadata is incomplete' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const hasFullBody = Boolean(bodyServiceId && bodyGuestEmail && bodySlotDate && bodySlotTime)
    if (hasFullBody) {
      if (
        meta.serviceId !== String(bodyServiceId) ||
        toDateOnlyString(String(meta.slotDate)) !== toDateOnlyString(String(bodySlotDate)) ||
        meta.slotTime !== String(bodySlotTime)
      ) {
        return new Response(JSON.stringify({ error: 'Payment does not match booking details' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (String(bodyGuestEmail).trim() !== String(mGuestEmail).trim()) {
        return new Response(JSON.stringify({ error: 'Payment does not match booking email' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (metaSlotOfferingId != null && slotOfferingId != null && metaSlotOfferingId !== slotOfferingId) {
        return new Response(JSON.stringify({ error: 'Payment does not match slot selection' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (metaSlotOfferingId != null && slotOfferingId == null) {
        slotOfferingId = metaSlotOfferingId
      }
      if (metaSlotOfferingId == null && slotOfferingId != null) {
        return new Response(
          JSON.stringify({ error: 'Payment was not started for this managed slot' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }
    }
    // Stripe metadata is the canonical slot for paid bookings (incl. /book/confirm with body omitted).
    serviceId = String(mServiceId)
    guestEmail = String(mGuestEmail).trim()
    slotDate = toDateOnlyString(String(mSlotDate))
    slotTime = String(mSlotTime)
    guestName = mGuestName ? String(mGuestName).trim() : undefined
    slotOfferingId = metaSlotOfferingId ?? slotOfferingId
    stripePaymentIntentId = pi.id
    const rawAmount = typeof pi.amount_received === 'number' ? pi.amount_received : pi.amount
    if (typeof rawAmount === 'number') {
      paidAmountPence = rawAmount
      paidCurrency = stripeCurrencyToBookingCurrency(pi.currency)
    }
  } else if (!serviceId || !guestEmail || !slotDate || !slotTime) {
    return new Response(
      JSON.stringify({ error: 'Missing serviceId, guestEmail, slotDate, or slotTime' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  slotDate = toDateOnlyString(String(slotDate))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate)) {
    return new Response(JSON.stringify({ error: 'Invalid slotDate (use YYYY-MM-DD)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const service = await payload
    .findByID({
      collection: 'services',
      id: typeof serviceId === 'string' ? serviceId : String(serviceId),
      depth: 1,
    })
    .catch(() => null)
  if (!service || !(service as { active?: boolean }).active) {
    return new Response(JSON.stringify({ error: 'Invalid or inactive service' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const linkedProductField = (service as { linkedProduct?: number | { id: number } | null }).linkedProduct
  const linkedProductId =
    typeof linkedProductField === 'object' && linkedProductField && 'id' in linkedProductField
      ? linkedProductField.id
      : linkedProductField

  if (slotOfferingId != null) {
    const slotErr = await validateSlotOfferingForBooking(payload, {
      slotOfferingId,
      serviceId: String(serviceId),
      slotDate,
      slotTime: String(slotTime),
    })
    if (slotErr) {
      return new Response(JSON.stringify({ error: slotErr }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (stripePaymentIntentId) {
    const existing = await payload.find({
      collection: 'bookings',
      where: { stripePaymentIntentId: { equals: stripePaymentIntentId } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      const existingId = (existing.docs[0] as { id: number }).id
      const full = await payload.findByID({
        collection: 'bookings',
        id: existingId,
        depth: 0,
      })
      return Response.json({
        success: true,
        id: existingId,
        accessToken: (full as Booking | null)?.accessToken ?? undefined,
        guestEmail: (full as Booking | null)?.guestEmail ?? undefined,
      })
    }
  }

  const doc = await payload.create({
    collection: 'bookings',
    data: {
      service: (service as { id: number }).id,
      guestEmail: String(guestEmail).trim(),
      guestName: guestName ? String(guestName).trim() : undefined,
      slotDate,
      slotTime: String(slotTime),
      status: 'pending',
      ...(user?.id ? { customer: user.id } : {}),
      ...(linkedProductId != null ? { product: linkedProductId } : {}),
      ...(slotOfferingId != null ? { slotOffering: slotOfferingId } : {}),
      ...(stripePaymentIntentId
        ? {
            stripePaymentIntentId,
            ...(paidAmountPence != null
              ? { amount: paidAmountPence, currency: paidCurrency ?? 'GBP' }
              : {}),
          }
        : {}),
    },
  })

  const bookingId = (doc as { id: number }).id
  let accessToken = (doc as Booking).accessToken ?? undefined

  if (stripePaymentIntentId && paidAmountPence != null) {
    const tx = await payload.create({
      collection: 'booking-transactions',
      data: {
        booking: bookingId,
        status: 'succeeded',
        amount: paidAmountPence,
        currency: paidCurrency ?? 'GBP',
        customerEmail: String(guestEmail).trim(),
        stripe: { paymentIntentID: stripePaymentIntentId },
      },
    })
    const updated = await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: {
        transactions: [(tx as { id: number }).id],
      },
    })
    accessToken = (updated as Booking).accessToken ?? accessToken
  }

  const cancelToken = createBookingCancelToken(bookingId)
  const bookingWithService = await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 1,
  }).catch(() => doc)
  sendBookingConfirmationEmail({
    payload,
    booking: bookingWithService as Booking,
    cancelToken,
  }).catch((err) => {
    payload.logger.warn({ msg: 'Failed to send booking confirmation email', err, bookingId })
  })

  const finalDoc = (bookingWithService as Booking | null) ?? (doc as Booking)

  return Response.json({
    success: true,
    id: doc.id,
    accessToken: accessToken ?? finalDoc.accessToken ?? undefined,
    guestEmail: finalDoc.guestEmail,
  })
}
