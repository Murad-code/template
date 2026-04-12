import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { getSiteConfig } from '@/config/site'
import { formatDateTime } from '@/utilities/formatDateTime'
import { formatDateDisplayDMY, toDateOnlyString } from '@/utilities/dateOnly'

type ServiceLike = { name?: string | null }
type BookingLike = {
  id: number
  createdAt?: string | null
  guestEmail?: string | null
  guestName?: string | null
  slotDate?: string | null
  slotTime?: string | null
  amount?: number | null
  currency?: string | null
  service?: ServiceLike | number | null
}

function serviceName(booking: BookingLike): string {
  const s = booking.service
  if (s && typeof s === 'object' && 'name' in s) return String((s as ServiceLike).name ?? 'Service')
  return 'Service'
}

/** Minimal UK-style invoice PDF for a paid booking (service + slot + total). */
export async function generateBookingInvoicePDF(booking: BookingLike): Promise<Uint8Array> {
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

  drawText(`Invoice number: B-${booking.id}`, colLeft, 11, true)
  nextLine(lineHeight)
  const invoiceDate = booking.createdAt ? formatDateTime({ date: booking.createdAt }) : ''
  drawText(`Invoice date: ${invoiceDate}`, colLeft, 10)
  nextLine(20)

  drawText('Bill to', colLeft, 10, true)
  nextLine(lineHeightSmall)
  if (booking.guestName) {
    drawText(booking.guestName, colLeft, 10)
    nextLine(lineHeightSmall)
  }
  if (booking.guestEmail) {
    drawText(booking.guestEmail, colLeft, 10)
    nextLine(lineHeightSmall)
  }
  nextLine(20)

  const slotDate = booking.slotDate ? formatDateDisplayDMY(toDateOnlyString(String(booking.slotDate))) : ''
  const desc = `${serviceName(booking)} — ${slotDate} ${booking.slotTime ?? ''}`.trim()
  drawText('Description', colLeft, 10, true)
  nextLine(16)
  drawText(desc.length > 72 ? `${desc.slice(0, 69)}…` : desc, colLeft, 10)
  nextLine(24)

  const totalCents = booking.amount ?? 0
  const totalPounds = totalCents / 100
  const colPrice = width - margin - 80

  if (companyVatNumber && vatRatePercent != null && vatRatePercent > 0) {
    const divisor = 1 + vatRatePercent / 100
    const subtotalExVatPounds = totalPounds / divisor
    const vatPounds = totalPounds - subtotalExVatPounds
    drawText('Subtotal (ex VAT)', colLeft, 10)
    page.drawText(`£${subtotalExVatPounds.toFixed(2)}`, { x: colPrice, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    nextLine(lineHeightSmall)
    drawText(`VAT (${vatRatePercent}%)`, colLeft, 10)
    page.drawText(`£${vatPounds.toFixed(2)}`, { x: colPrice, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) })
    nextLine(lineHeightSmall)
    drawText(`VAT registration number: ${companyVatNumber}`, colLeft, 9)
    nextLine(lineHeightSmall)
  }

  drawText('Total', colLeft, 11, true)
  page.drawText(`£${totalPounds.toFixed(2)} ${booking.currency ?? 'GBP'}`, {
    x: colPrice,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })

  return doc.save()
}
