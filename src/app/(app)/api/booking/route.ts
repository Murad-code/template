import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'

export async function POST(request: Request): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json().catch(() => ({}))
  const { guestEmail, guestName, slotDate, slotTime } = body
  if (!guestEmail || !slotDate || !slotTime) {
    return new Response(
      JSON.stringify({ error: 'Missing guestEmail, slotDate, or slotTime' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const payload = await getPayload({ config: configPromise })
  const doc = await payload.create({
    collection: 'bookings',
    data: {
      guestEmail: String(guestEmail).trim(),
      guestName: guestName ? String(guestName).trim() : undefined,
      slotDate: String(slotDate),
      slotTime: String(slotTime),
      status: 'pending',
    },
  })
  return Response.json({ success: true, id: doc.id })
}
