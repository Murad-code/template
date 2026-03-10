import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { Order } from '@/payload-types'
import { getSiteConfig } from '@/config/site'

type OrderWithRefund = Order & { refundedAt?: string | null; refundAmount?: number | null }

/**
 * Generate a refund receipt PDF for an order. Uses company details from site config.
 * Call after the order has been updated with refundedAt and refundAmount.
 */
export async function generateRefundReceiptPDF(order: OrderWithRefund): Promise<Uint8Array> {
  const { companyName, companyAddress } = getSiteConfig()
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([595, 842])
  const { width } = page.getSize()
  const margin = 50
  let y = 842 - margin

  const drawText = (text: string, x: number, size: number, bold = false) => {
    const f = bold ? fontBold : font
    page.drawText(text, { x, y, size, font: f, color: rgb(0.1, 0.1, 0.1) })
  }

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

  drawText('Refund receipt', margin, 14, true)
  y -= 24
  drawText(`Order #${order.id}`, margin, 11)
  y -= 16
  const refundDate = order.refundedAt
    ? new Date(order.refundedAt).toLocaleDateString(undefined, {
        dateStyle: 'medium',
      })
    : ''
  drawText(`Refund date: ${refundDate}`, margin, 10)
  y -= 16
  if (order.customerEmail) {
    drawText(`Refund to: ${order.customerEmail}`, margin, 10)
    y -= 16
  }
  y -= 20

  const refundAmountPence = order.refundAmount ?? 0
  const refundPounds = (refundAmountPence / 100).toFixed(2)
  drawText('Refund amount', margin, 11, true)
  page.drawText(`£${refundPounds} GBP`, {
    x: width - margin - 80,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  y -= 24

  const originalTotalPence = order.amount ?? 0
  if (originalTotalPence > 0) {
    drawText('Original order total', margin, 10)
    const originalPounds = (originalTotalPence / 100).toFixed(2)
    page.drawText(`£${originalPounds} GBP`, {
      x: width - margin - 80,
      y,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    })
  }

  const pdfBytes = await doc.save()
  return pdfBytes
}
