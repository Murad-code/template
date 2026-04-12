import { getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'
import { generateBookingInvoicePDF } from '@/utilities/generateBookingInvoicePDF'
import { getSiteConfig } from '@/config/site'
import type { Booking } from '@/payload-types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
): Promise<Response> {
  const { bookingId } = await params
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

  let booking: Booking | null = null

  if (user && checkRole(['admin'], user)) {
    booking = (await payload
      .findByID({
        collection: 'bookings',
        id: bookingId,
        depth: 2,
      })
      .catch(() => null)) as Booking | null
  } else if (user?.id) {
    const {
      docs: [row],
    } = await payload.find({
      collection: 'bookings',
      user,
      overrideAccess: false,
      depth: 2,
      limit: 1,
      where: {
        and: [{ id: { equals: bookingId } }, { customer: { equals: user.id } }],
      },
    })
    booking = (row as Booking | undefined) ?? null
  } else if (email && accessToken) {
    const {
      docs: [row],
    } = await payload.find({
      collection: 'bookings',
      depth: 2,
      limit: 1,
      where: {
        and: [
          { id: { equals: bookingId } },
          { accessToken: { equals: accessToken } },
          { guestEmail: { equals: email } },
        ],
      },
      overrideAccess: true,
    })
    booking = (row as Booking | undefined) ?? null
  } else {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!booking) {
    return new Response('Booking not found', { status: 404 })
  }

  const pdfBytes = await generateBookingInvoicePDF(booking)
  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="booking-invoice-${bookingId}.pdf"`,
    },
  })
}
