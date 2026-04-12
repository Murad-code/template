import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'
import { toDateOnlyString } from '@/utilities/dateOnly'
import Stripe from 'stripe'

/**
 * POST /api/booking/create-payment-intent
 * Body: { serviceId, slotDate, slotTime, guestEmail [, guestName] }
 * Returns { clientSecret, amount } for Stripe Elements when the service has a price (pay at book).
 */
export async function POST(request: Request): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json().catch(() => ({}))
  const { serviceId, slotDate, slotTime, guestEmail, guestName } = body
  if (!serviceId || !slotDate || !slotTime || !guestEmail) {
    return new Response(
      JSON.stringify({ error: 'Missing serviceId, slotDate, slotTime, or guestEmail' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const slotDateOnly = toDateOnlyString(String(slotDate))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDateOnly)) {
    return new Response(JSON.stringify({ error: 'Invalid slotDate (use YYYY-MM-DD)' }), {
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

  const payload = await getPayload({ config: configPromise })
  const service = await payload
    .findByID({
      collection: 'services',
      id: typeof serviceId === 'string' ? serviceId : String(serviceId),
      depth: 0,
    })
    .catch(() => null)

  if (!service || !(service as { active?: boolean }).active) {
    return new Response(JSON.stringify({ error: 'Invalid or inactive service' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const svc = service as {
    enabledPriceInGBP?: boolean | null
    priceInGBP?: number | null
  }
  if (!svc.enabledPriceInGBP || svc.priceInGBP == null || svc.priceInGBP <= 0) {
    return new Response(JSON.stringify({ error: 'This service has no price set for payment' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const stripe = new Stripe(secretKey)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(svc.priceInGBP),
    currency: 'gbp',
    automatic_payment_methods: { enabled: true },
    metadata: {
      type: 'booking',
      serviceId: String(serviceId),
      slotDate: slotDateOnly,
      slotTime: String(slotTime),
      guestEmail: String(guestEmail).trim(),
      ...(guestName ? { guestName: String(guestName).trim() } : {}),
    },
    receipt_email: String(guestEmail).trim(),
  })

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
  })
}
