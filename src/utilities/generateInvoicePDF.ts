import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { Order } from '@/payload-types'
import { getSiteConfig } from '@/config/site'

type OrderItem = NonNullable<Order['items']>[number]
type ProductLike = { title?: string | null; priceInUSD?: number | null }
type VariantLike = { title?: string | null; priceInUSD?: number | null }

function getItemTitle(item: OrderItem): string {
  const product = item.product as ProductLike | undefined
  const variant = item.variant as VariantLike | undefined
  if (variant?.title) return `${product?.title ?? 'Product'} – ${variant.title}`
  return product?.title ?? 'Item'
}

function getItemUnitPriceCents(item: OrderItem): number {
  const variant = item.variant as VariantLike | undefined
  const product = item.product as ProductLike | undefined
  const price = variant?.priceInUSD ?? product?.priceInUSD
  return typeof price === 'number' ? price : 0
}

/**
 * Generate an invoice PDF for an order. Company details from site config.
 */
export async function generateInvoicePDF(order: Order): Promise<Uint8Array> {
  const { companyName, companyAddress } = getSiteConfig()
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([595, 842])
  const { width, height } = page.getSize()
  const margin = 50
  let y = height - margin

  const drawText = (text: string, x: number, size: number, bold = false) => {
    const f = bold ? fontBold : font
    page.drawText(text, { x, y, size, font: f, color: rgb(0.1, 0.1, 0.1) })
  }

  // Header: company name
  drawText(companyName || 'Company', margin, 18, true)
  y -= 22
  if (companyAddress) {
    companyAddress.split('\n').forEach((line) => {
      drawText(line.trim(), margin, 10)
      y -= 14
    })
    y -= 8
  } else {
    y -= 8
  }

  // Invoice title and order ref
  drawText(`Invoice #${order.id}`, margin, 14, true)
  y -= 20
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''
  drawText(`Date: ${orderDate}`, margin, 10)
  y -= 14
  if (order.customerEmail) {
    drawText(`Bill to: ${order.customerEmail}`, margin, 10)
    y -= 14
  }
  y -= 20

  // Table header
  const colDesc = margin
  const colQty = width - margin - 80
  const colPrice = width - margin - 50
  drawText('Description', colDesc, 10, true)
  page.drawText('Qty', { x: colQty, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
  page.drawText('Amount', { x: colPrice, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
  y -= 18
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  })
  y -= 14

  const items = order.items ?? []
  for (const item of items) {
    const title = getItemTitle(item)
    const qty = item.quantity ?? 0
    const unitCents = getItemUnitPriceCents(item)
    const lineTotalCents = qty * unitCents
    const lineTotal = (lineTotalCents / 100).toFixed(2)
    const unitPrice = (unitCents / 100).toFixed(2)
    drawText(title.length > 50 ? title.slice(0, 47) + '...' : title, colDesc, 10)
    page.drawText(String(qty), { x: colQty, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    page.drawText(`$${lineTotal}`, { x: colPrice, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    y -= 16
  }

  y -= 14
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  })
  y -= 18
  const totalCents = order.amount ?? 0
  const total = (totalCents / 100).toFixed(2)
  drawText('Total', colDesc, 11, true)
  page.drawText(`$${total} USD`, { x: colPrice, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) })

  const pdfBytes = await doc.save()
  return pdfBytes
}
