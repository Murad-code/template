import { getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'
import { generateInvoicePDF } from '@/utilities/generateInvoicePDF'
import { getSiteConfig } from '@/config/site'
import type { Order } from '@/payload-types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const { orderId } = await params
  const { enableInvoices } = getSiteConfig()
  if (!enableInvoices) {
    return new Response('Invoices are disabled', { status: 403 })
  }

  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  const url = new URL(request.url)
  const accessToken = url.searchParams.get('accessToken') ?? ''
  const email = url.searchParams.get('email') ?? ''

  let order: Order | null = null

  if (user && checkRole(['admin'], user)) {
    order = (await payload
      .findByID({
        collection: 'orders',
        id: orderId,
        depth: 2,
      })
      .catch(() => null)) as Order | null
  } else if (user?.id) {
    const {
      docs: [row],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: false,
      depth: 2,
      limit: 1,
      where: {
        and: [{ id: { equals: orderId } }, { customer: { equals: user.id } }],
      },
    })
    order = (row as Order | undefined) ?? null
  } else if (email && accessToken) {
    const {
      docs: [row],
    } = await payload.find({
      collection: 'orders',
      depth: 2,
      limit: 1,
      where: {
        and: [
          { id: { equals: orderId } },
          { accessToken: { equals: accessToken } },
          { customerEmail: { equals: email } },
        ],
      },
      overrideAccess: true,
    })
    order = (row as Order | undefined) ?? null
  } else {
    return new Response('Unauthorized', { status: 401 })
  }

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
