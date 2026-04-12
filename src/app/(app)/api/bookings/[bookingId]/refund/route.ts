import { createLocalReq, getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import Stripe from 'stripe'
import { checkRole } from '@/access/utilities'
import type { Booking, BookingTransaction } from '@/payload-types'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
): Promise<Response> {
  const { bookingId } = await params
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user || !checkRole(['admin'], user)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await _request.json().catch(() => ({}))
  const amountCents = typeof body.amount === 'number' ? Math.round(body.amount) : undefined

  const booking = (await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 2,
  })) as Booking | null

  if (!booking) {
    return new Response(JSON.stringify({ error: 'Booking not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (booking.status === 'refunded') {
    return new Response(JSON.stringify({ error: 'Booking is already refunded' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const txs = booking.transactions as BookingTransaction[] | undefined
  const succeededTx = Array.isArray(txs)
    ? txs.find((t) => t.status === 'succeeded' && t.stripe?.paymentIntentID)
    : undefined
  const paymentIntentId =
    succeededTx?.stripe?.paymentIntentID ?? booking.stripePaymentIntentId ?? undefined

  if (!paymentIntentId) {
    return new Response(JSON.stringify({ error: 'No successful payment found for this booking' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Stripe is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const stripe = new Stripe(secretKey)
  const bookingTotalCents = typeof booking.amount === 'number' ? booking.amount : 0
  const refundAmount = amountCents ?? bookingTotalCents
  if (refundAmount <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid refund amount' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (refundAmount > bookingTotalCents) {
    return new Response(JSON.stringify({ error: 'Refund amount cannot exceed booking total' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe refund failed'
    payload.logger.error({ err, bookingId }, 'Stripe booking refund failed')
    return new Response(JSON.stringify({ error: message }), {
      status: 402,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const req = await createLocalReq({ user }, payload)

  await payload.update({
    collection: 'bookings',
    id: bookingId,
    data: {
      status: 'refunded',
      refundedAt: new Date().toISOString(),
      refundAmount: refundAmount,
    },
    req,
    overrideAccess: false,
  })

  if (Array.isArray(txs)) {
    for (const tx of txs) {
      if (tx.status === 'succeeded' && tx.id) {
        await payload.update({
          collection: 'booking-transactions',
          id: tx.id,
          data: { status: 'refunded' },
          req,
          overrideAccess: false,
        })
      }
    }
  }

  return new Response(JSON.stringify({ success: true, refundAmount }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
