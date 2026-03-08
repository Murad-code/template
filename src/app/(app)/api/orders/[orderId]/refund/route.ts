import { createLocalReq, getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import Stripe from 'stripe'
import { checkRole } from '@/access/utilities'
import type { Order, Transaction } from '@/payload-types'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const { orderId } = await params
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
  const reason = typeof body.reason === 'string' ? body.reason : undefined

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 2,
  }) as Order & { refundedAt?: string; refundAmount?: number }

  if (!order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (order.status === 'refunded') {
    return new Response(
      JSON.stringify({ error: 'Order is already refunded' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const transactions = order.transactions as Transaction[] | undefined
  const succeededTx = Array.isArray(transactions)
    ? transactions.find((t) => t.status === 'succeeded' && t.stripe?.paymentIntentID)
    : undefined
  const paymentIntentId = succeededTx?.stripe?.paymentIntentID

  if (!paymentIntentId) {
    return new Response(
      JSON.stringify({ error: 'No successful payment found for this order' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return new Response(
      JSON.stringify({ error: 'Stripe is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const stripe = new Stripe(secretKey)
  const refundAmount = amountCents ?? order.amount ?? 0
  if (refundAmount <= 0) {
    return new Response(
      JSON.stringify({ error: 'Invalid refund amount' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
      ...(reason && ['duplicate', 'fraudulent', 'requested_by_customer'].includes(reason)
        ? { reason: reason as 'duplicate' | 'fraudulent' | 'requested_by_customer' }
        : {}),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe refund failed'
    payload.logger.error({ err, orderId }, 'Stripe refund failed')
    return new Response(
      JSON.stringify({ error: message }),
      { status: 402, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const req = await createLocalReq({ user }, payload)

  await payload.update({
    collection: 'orders',
    id: orderId,
    data: {
      status: 'refunded',
      refundedAt: new Date().toISOString(),
      refundAmount: refundAmount,
    },
    req,
    overrideAccess: false,
  })

  return new Response(
    JSON.stringify({ success: true, refundAmount }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
