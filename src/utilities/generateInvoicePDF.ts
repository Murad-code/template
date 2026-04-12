import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { Order } from '@/payload-types'
import { getSiteConfig } from '@/config/site'
import { formatDateTime } from '@/utilities/formatDateTime'

type OrderItem = NonNullable<Order['items']>[number]
type ProductLike = { title?: string | null; priceInGBP?: number | null }
type VariantLike = { title?: string | null; priceInGBP?: number | null }
type ShippingAddress = NonNullable<Order['shippingAddress']>

function getItemTitle(item: OrderItem): string {
  const product = item.product as ProductLike | undefined
  const variant = item.variant as VariantLike | undefined
  if (variant?.title) return `${product?.title ?? 'Product'} – ${variant.title}`
  return product?.title ?? 'Item'
}

function getItemUnitPriceCents(item: OrderItem): number {
  const variant = item.variant as VariantLike | undefined
  const product = item.product as ProductLike | undefined
  const price = variant?.priceInGBP ?? product?.priceInGBP
  return typeof price === 'number' ? price : 0
}

function formatAddress(addr: ShippingAddress): string[] {
  const lines: string[] = []
  const name = [addr.title, addr.firstName, addr.lastName].filter(Boolean).join(' ')
  if (name) lines.push(name)
  if (addr.company) lines.push(addr.company)
  if (addr.addressLine1) lines.push(addr.addressLine1)
  if (addr.addressLine2) lines.push(addr.addressLine2)
  const cityLine = [addr.city, addr.state, addr.postalCode].filter(Boolean).join(' ')
  if (cityLine) lines.push(cityLine)
  if (addr.country) lines.push(addr.country)
  if (addr.phone) lines.push(`Tel: ${addr.phone}`)
  return lines
}

/**
 * Generate an invoice PDF for an order meeting UK Gov requirements:
 * - Unique identification number
 * - Company name, address and contact information
 * - Customer name and address
 * - Description of what's charged, dates, amounts, VAT if applicable, total
 * - Sole trader: legal name and address for legal documents if using business name
 */
export async function generateInvoicePDF(order: Order): Promise<Uint8Array> {
  const config = getSiteConfig()
  const {
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyVatNumber,
    vatRatePercent,
    soleTraderLegalName,
    soleTraderLegalAddress,
  } = config

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([595, 842])
  const { width, height } = page.getSize()
  const margin = 50
  const colLeft = margin
  const colRight = width / 2 + 20
  let y = height - margin
  const lineHeight = 14
  const lineHeightSmall = 12

  const drawText = (text: string, x: number, size: number, bold = false) => {
    const f = bold ? fontBold : font
    page.drawText(text, { x, y, size, font: f, color: rgb(0.1, 0.1, 0.1) })
  }

  const nextLine = (delta = lineHeight) => {
    y -= delta
  }

  // —— Supplier (your company) ——
  drawText(companyName || 'Company', colLeft, 16, true)
  nextLine(20)
  if (companyAddress) {
    companyAddress.split('\n').forEach((line) => {
      drawText(line.trim(), colLeft, 10)
      nextLine(lineHeightSmall)
    })
  }
  if (companyPhone) {
    drawText(`Tel: ${companyPhone}`, colLeft, 10)
    nextLine(lineHeightSmall)
  }
  if (companyEmail) {
    drawText(`Email: ${companyEmail}`, colLeft, 10)
    nextLine(lineHeightSmall)
  }
  // Sole trader: name and address for legal documents
  if (soleTraderLegalName) {
    nextLine(4)
    drawText('Sole trader', colLeft, 9, true)
    nextLine(lineHeightSmall)
    drawText(`Legal name: ${soleTraderLegalName}`, colLeft, 9)
    nextLine(lineHeightSmall)
    if (soleTraderLegalAddress) {
      soleTraderLegalAddress.split('\n').forEach((line) => {
        drawText(line.trim(), colLeft, 9)
        nextLine(lineHeightSmall)
      })
    }
  }
  nextLine(16)

  // —— Invoice number (unique identification) and dates ——
  drawText(`Invoice number: ${order.id}`, colLeft, 11, true)
  nextLine(lineHeight)
  const invoiceDate = order.createdAt ? formatDateTime({ date: order.createdAt }) : ''
  drawText(`Invoice date: ${invoiceDate}`, colLeft, 10)
  nextLine(lineHeightSmall)
  drawText(`Supply date: ${invoiceDate}`, colLeft, 10)
  nextLine(20)

  // —— Customer (company name and address of the customer you're invoicing) ——
  drawText('Bill to', colLeft, 10, true)
  nextLine(lineHeightSmall)
  const customerEmail = order.customerEmail ?? (typeof order.customer === 'object' && order.customer?.email ? order.customer.email : null)
  if (order.shippingAddress) {
    const addrLines = formatAddress(order.shippingAddress)
    addrLines.forEach((line) => {
      drawText(line, colLeft, 10)
      nextLine(lineHeightSmall)
    })
  }
  if (customerEmail) {
    drawText(customerEmail, colLeft, 10)
    nextLine(lineHeightSmall)
  }
  if (!order.shippingAddress && !customerEmail) {
    drawText('Customer', colLeft, 10)
    nextLine(lineHeightSmall)
  }
  nextLine(20)

  // —— Table: description of what you're charging for, amounts ——
  const colDesc = colLeft
  const colQty = width - margin - 100
  const colPrice = width - margin - 60
  drawText('Description', colDesc, 10, true)
  page.drawText('Qty', { x: colQty, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
  page.drawText('Amount', { x: colPrice, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
  nextLine(18)
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  })
  nextLine(14)

  const items = order.items ?? []
  for (const item of items) {
    const title = getItemTitle(item)
    const qty = item.quantity ?? 0
    const unitCents = getItemUnitPriceCents(item)
    const lineTotalCents = qty * unitCents
    const lineTotal = (lineTotalCents / 100).toFixed(2)
    drawText(title.length > 45 ? title.slice(0, 42) + '...' : title, colDesc, 10)
    page.drawText(String(qty), { x: colQty, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    page.drawText(`£${lineTotal}`, { x: colPrice, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    nextLine(16)
  }

  nextLine(14)
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  })
  nextLine(18)

  // Total amount owed (and VAT if applicable)
  const totalCents = order.amount ?? 0
  const totalPounds = totalCents / 100

  if (companyVatNumber && vatRatePercent != null && vatRatePercent > 0) {
    // Assume total is inclusive of VAT; back-calculate for display
    const divisor = 1 + vatRatePercent / 100
    const subtotalExVatPounds = totalPounds / divisor
    const vatPounds = totalPounds - subtotalExVatPounds
    drawText('Subtotal (ex VAT)', colDesc, 10)
    page.drawText(`£${subtotalExVatPounds.toFixed(2)}`, { x: colPrice, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    nextLine(lineHeightSmall)
    drawText(`VAT (${vatRatePercent}%)`, colDesc, 10)
    page.drawText(`£${vatPounds.toFixed(2)}`, { x: colPrice, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    nextLine(lineHeightSmall)
    drawText(`VAT registration number: ${companyVatNumber}`, colLeft, 9)
    nextLine(lineHeightSmall)
  }

  drawText('Total amount owed', colDesc, 11, true)
  page.drawText(`£${totalPounds.toFixed(2)} GBP`, { x: colPrice, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) })

  const pdfBytes = await doc.save()
  return pdfBytes
}
