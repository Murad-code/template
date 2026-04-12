import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'
import { verifyBookingCancelToken } from '@/utilities/bookingCancelToken'
import { toDateOnlyString } from '@/utilities/dateOnly'

/**
 * GET /api/booking/cancel-preview?token=… — public preview for cancel page (no login).
 */
export async function GET(request: Request): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const token = new URL(request.url).searchParams.get('token')
  const bookingId = token ? verifyBookingCancelToken(token) : null
  if (!bookingId) {
    return new Response(JSON.stringify({ error: 'Invalid or expired link' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const booking = await payload
    .findByID({
      collection: 'bookings',
      id: bookingId,
      depth: 1,
    })
    .catch(() => null)

  if (!booking) {
    return new Response(JSON.stringify({ error: 'Booking not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const b = booking as {
    id: number
    status?: string
    slotDate: string
    slotTime: string
    service?: { name?: string } | number | null
  }

  if (b.status === 'cancelled') {
    return new Response(JSON.stringify({ error: 'This booking is already cancelled' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const serviceName =
    b.service && typeof b.service === 'object' && 'name' in b.service && b.service.name
      ? String(b.service.name)
      : 'Booking'

  return Response.json({
    id: b.id,
    serviceName,
    slotDate: toDateOnlyString(b.slotDate),
    slotTime: b.slotTime,
  })
}
