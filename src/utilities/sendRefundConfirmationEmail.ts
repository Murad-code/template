import type { Order } from '@/payload-types'
import type { PayloadRequest } from 'payload'
import { getSiteConfig } from '@/config/site'
import { generateRefundReceiptPDF } from '@/utilities/generateRefundReceiptPDF'

type CustomerLike = { email?: string | null } | number | null

function getOrderRecipientEmail(order: Order): string | null {
  if (order.customerEmail && typeof order.customerEmail === 'string') {
    return order.customerEmail
  }
  const customer = order.customer as CustomerLike | undefined
  if (customer && typeof customer === 'object' && customer.email) {
    return customer.email
  }
  return null
}

function formatAmount(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

type OrderWithRefund = Order & { refundedAt?: string | null; refundAmount?: number | null }

/**
 * Sends a refund confirmation email to the customer with a refund receipt PDF attached.
 * Call after an order has been updated with status 'refunded', refundedAt, and refundAmount.
 */
export async function sendRefundConfirmationEmail({
  order,
  req,
}: {
  order: OrderWithRefund
  req: PayloadRequest
}): Promise<void> {
  const email = getOrderRecipientEmail(order)
  if (!email) {
    req.payload.logger.warn({
      msg: 'Refund confirmation email skipped: no recipient email',
      orderId: order.id,
    })
    return
  }
  if (!req.payload.config.email) {
    req.payload.logger.warn({
      msg: 'Refund confirmation email skipped: no email adapter configured',
      orderId: order.id,
    })
    return
  }

  const { siteName } = getSiteConfig()
  const refundAmountPence = order.refundAmount ?? 0
  const refundFormatted = formatAmount(refundAmountPence)
  const refundDate = order.refundedAt
    ? new Date(order.refundedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
    : ''

  const html = `
    <h1>Refund processed</h1>
    <p>Your refund for order <strong>#${order.id}</strong> has been processed.</p>
    <p><strong>Refund amount:</strong> ${refundFormatted}</p>
    <p><strong>Date:</strong> ${refundDate}</p>
    <p>Please find your refund receipt attached to this email.</p>
    <p>If you have any questions, please contact us.</p>
    <p>— ${siteName}</p>
  `

  const attachments: { filename: string; content: Buffer }[] = []

  try {
    const pdfBytes = await generateRefundReceiptPDF(order)
    attachments.push({
      filename: `refund-receipt-order-${order.id}.pdf`,
      content: Buffer.from(pdfBytes),
    })
  } catch (err) {
    req.payload.logger.warn({
      msg: 'Could not generate refund receipt PDF',
      orderId: order.id,
      err,
    })
  }

  req.payload.logger.info({
    msg: 'Sending refund confirmation email',
    orderId: order.id,
    to: email,
  })

  await req.payload.sendEmail({
    to: email,
    subject: `Refund processed for order #${order.id} – ${siteName}`,
    html,
    ...(attachments.length > 0 ? { attachments } : {}),
  })

  req.payload.logger.info({
    msg: 'Refund confirmation email sent',
    orderId: order.id,
    to: email,
  })
}
