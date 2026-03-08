import { getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'
import { generateInvoicePDF } from '@/utilities/generateInvoicePDF'
import { getSiteConfig } from '@/config/site'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const { orderId } = await params
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user || !checkRole(['admin'], user)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { enableInvoices } = getSiteConfig()
  if (!enableInvoices) {
    return new Response('Invoices are disabled', { status: 403 })
  }

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 2,
  })

  if (!order) {
    return new Response('Order not found', { status: 404 })
  }

  const pdfBytes = await generateInvoicePDF(order)
  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${orderId}.pdf"`,
    },
  })
}
