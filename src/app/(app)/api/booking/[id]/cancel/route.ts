import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'
import { verifyBookingCancelToken } from '@/utilities/bookingCancelToken'

/**
 * POST /api/booking/:id/cancel — body { token }; token must match signed booking id.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id: idParam } = await params
  const urlId = parseInt(idParam, 10)
  if (!Number.isFinite(urlId)) {
    return new Response(JSON.stringify({ error: 'Invalid booking id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json().catch(() => ({}))
  const token = typeof body.token === 'string' ? body.token : ''
  const tokenId = verifyBookingCancelToken(token)
  if (tokenId !== urlId) {
    return new Response(JSON.stringify({ error: 'Invalid or expired link' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const existing = await payload.findByID({ collection: 'bookings', id: urlId, depth: 0 }).catch(() => null)
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Booking not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if ((existing as { status?: string }).status === 'cancelled') {
    return Response.json({ success: true, alreadyCancelled: true })
  }

  await payload.update({
    collection: 'bookings',
    id: urlId,
    data: { status: 'cancelled' },
  })

  return Response.json({ success: true })
}
