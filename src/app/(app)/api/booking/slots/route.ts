import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getBlockedRanges, isDateBlocked } from '@/utilities/getBlockedRanges'
import { getSiteConfig } from '@/config/site'

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

export async function GET(request: Request): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response(JSON.stringify({ error: 'Invalid date (use YYYY-MM-DD)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const [blockedRanges, settings] = await Promise.all([
    getBlockedRanges(payload),
    payload.getGlobal({ slug: 'booking-settings' }),
  ])

  if (isDateBlocked(date, blockedRanges)) {
    return Response.json([])
  }

  const slotDuration = (settings as { slotDurationMinutes?: number })?.slotDurationMinutes ?? 30
  const startHour = (settings as { defaultStartHour?: number })?.defaultStartHour ?? 9
  const endHour = (settings as { defaultEndHour?: number })?.defaultEndHour ?? 17

  const slots: string[] = []
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += slotDuration) {
      slots.push(`${pad(h)}:${pad(m)}`)
    }
  }

  const { docs: existing } = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { slotDate: { equals: date } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    depth: 0,
    limit: 500,
  })

  const taken = new Set((existing as { slotTime?: string }[]).map((b) => b.slotTime).filter(Boolean))
  const available = slots.filter((s) => !taken.has(s))
  return Response.json(available)
}
