import type { Order } from '@/payload-types'
import type { PayloadRequest } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'
import { getSiteConfig } from '@/config/site'
import { generateInvoicePDF } from '@/utilities/generateInvoicePDF'

type ProductLike = { title?: string | null }
type VariantLike = { title?: string | null }
type OrderItem = NonNullable<Order['items']>[number]

/** Customer when populated (depth >= 1); User has email. */
type CustomerLike = { email?: string | null } | number | null

/**
 * Resolves the recipient email for an order.
 * Guest orders have customerEmail; logged-in orders have customer (user) and we use their email.
 */
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

function getItemTitle(item: OrderItem): string {
  const product = item.product as ProductLike | undefined
  const variant = item.variant as VariantLike | undefined
  if (variant?.title && product?.title) return `${product.title} – ${variant.title}`
  return (product?.title as string) ?? 'Item'
}

function formatAmount(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

/**
 * Sends order confirmation email to the customer with order summary and optional invoice PDF.
 * Call after an order is created (e.g. in orders collection afterChange hook).
 */
export async function sendOrderConfirmationEmail({
  order,
  req,
}: {
  order: Order
  req: PayloadRequest
}): Promise<void> {
  const email = getOrderRecipientEmail(order)
  if (!email) {
    req.payload.logger.warn({
      msg: 'Order confirmation email skipped: no recipient email (order has no customerEmail and no populated customer with email)',
      orderId: order.id,
    })
    return
  }
  if (!req.payload.config.email) {
    req.payload.logger.warn({
      msg: 'Order confirmation email skipped: no email adapter configured (set RESEND_API_KEY or SMTP_*)',
      orderId: order.id,
    })
    return
  }

  const { siteName } = getSiteConfig()
  const serverURL = getServerSideURL()
  const orderURL = `${serverURL}/orders/${order.id}${order.accessToken ? `?email=${encodeURIComponent(email)}&accessToken=${order.accessToken}` : ''}`

  const itemsList =
    order.items
      ?.map((item) => {
        const title = getItemTitle(item)
        const qty = item.quantity ?? 0
        return `<li>${title} × ${qty}</li>`
      })
      .join('') ?? ''

  const totalFormatted = order.amount != null ? formatAmount(order.amount) : ''

  const html = `
    <h1>Order confirmed</h1>
    <p>Thank you for your order.</p>
    <p><strong>Order #${order.id}</strong></p>
    <p>Total: ${totalFormatted}</p>
    ${itemsList ? `<ul>${itemsList}</ul>` : ''}
    <p><a href="${orderURL}">View your order</a></p>
    <p>If you have any questions, please contact us.</p>
    <p>— ${siteName}</p>
  `

  const attachments: { filename: string; content: Buffer }[] = []

  try {
    const pdfBytes = await generateInvoicePDF(order)
    attachments.push({ filename: `invoice-${order.id}.pdf`, content: Buffer.from(pdfBytes) })
  } catch (err) {
    req.payload.logger.warn({ msg: 'Could not generate invoice PDF for order confirmation email', err })
  }

  req.payload.logger.info({
    msg: 'Sending order confirmation email',
    orderId: order.id,
    to: email,
  })

  await req.payload.sendEmail({
    to: email,
    subject: `Order confirmed #${order.id} – ${siteName}`,
    html,
    ...(attachments.length > 0 ? { attachments } : {}),
  })

  req.payload.logger.info({
    msg: 'Order confirmation email sent',
    orderId: order.id,
    to: email,
  })
}
