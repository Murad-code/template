import type { Payload } from 'payload'

import { getLowStockAlertRecipient } from '@/config/stock'
import { getSiteConfig } from '@/config/site'

type ProductLike = { id: number; title?: string | null; inventory?: number | null; lowStockThreshold?: number | null }

/**
 * Sends a one-off admin alert when inventory crosses at or below lowStockThreshold.
 */
export async function sendLowStockAlertEmail({
  payload,
  product,
  variantLabel,
}: {
  payload: Payload
  product: ProductLike
  variantLabel?: string
}): Promise<void> {
  if (!payload.config.email) {
    payload.logger.warn({ msg: 'Low stock alert skipped: no email adapter', productId: product.id })
    return
  }

  const to = getLowStockAlertRecipient()
  if (!to) {
    payload.logger.warn({ msg: 'Low stock alert skipped: set LOW_STOCK_ALERT_TO or SMTP_FROM_EMAIL', productId: product.id })
    return
  }

  const { siteName, serverURL } = getSiteConfig()
  const title = product.title ?? `Product #${product.id}`
  const inv = product.inventory ?? 0
  const threshold = product.lowStockThreshold ?? 0
  const scope = variantLabel ? `${title} (${variantLabel})` : title

  await payload.sendEmail({
    to,
    subject: `[${siteName}] Low stock: ${scope}`,
    html: `
      <p>Inventory for <strong>${scope}</strong> is now at or below the low-stock threshold.</p>
      <ul>
        <li>Current inventory: <strong>${inv}</strong></li>
        <li>Threshold: <strong>${threshold}</strong></li>
        <li>Product ID: ${product.id}</li>
      </ul>
      <p><a href="${serverURL}/admin/collections/products/${product.id}">Open in admin</a></p>
    `.trim(),
  })
}
