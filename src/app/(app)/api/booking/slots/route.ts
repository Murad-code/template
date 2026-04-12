import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getBlockedRanges, isDateBlocked } from '@/utilities/getBlockedRanges'
import { getSiteConfig } from '@/config/site'
import { toDateOnlyString } from '@/utilities/dateOnly'

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

/** Parse "HH:mm" to minutes since midnight */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** Check if slot [slotStart, slotStart + durationMinutes) overlaps booking [bookStart, bookStart + bookDuration) */
function overlaps(
  slotStartMins: number,
  slotDurationMins: number,
  bookStartMins: number,
  bookDurationMins: number,
): boolean {
  return slotStartMins < bookStartMins + bookDurationMins && bookStartMins < slotStartMins + slotDurationMins
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
  const date = toDateOnlyString(searchParams.get('date') ?? '')
  const serviceId = searchParams.get('serviceId')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response(JSON.stringify({ error: 'Invalid date (use YYYY-MM-DD)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const [blockedRanges, settings, service] = await Promise.all([
    getBlockedRanges(payload),
    payload.findGlobal({ slug: 'booking-settings', depth: 0 }),
    serviceId
      ? payload.findByID({ collection: 'services', id: serviceId, depth: 0 }).catch(() => null)
      : Promise.resolve(null),
  ])

  if (isDateBlocked(date, blockedRanges)) {
    return Response.json([])
  }

  const slotDuration =
    (service as { durationMinutes?: number } | null)?.durationMinutes ??
    (settings as { slotDurationMinutes?: number })?.slotDurationMinutes ??
    30
  const startHour = (settings as { defaultStartHour?: number })?.defaultStartHour ?? 9
  const endHour = (settings as { defaultEndHour?: number })?.defaultEndHour ?? 17

  const startMins = startHour * 60
  const endMins = endHour * 60
  const slots: string[] = []
  for (let mins = startMins; mins + slotDuration <= endMins; mins += slotDuration) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    slots.push(`${pad(h)}:${pad(m)}`)
  }

  const { docs: existing } = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { slotDate: { equals: date } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    depth: 1,
    limit: 500,
  })

  const available = slots.filter((slot) => {
    const slotMins = timeToMinutes(slot)
    const blockedByBooking = (existing as { slotTime?: string; service?: { durationMinutes?: number } }[]).some(
      (b) => {
        const bookStart = b.slotTime ? timeToMinutes(b.slotTime) : 0
        const bookDuration = b.service?.durationMinutes ?? slotDuration
        return overlaps(slotMins, slotDuration, bookStart, bookDuration)
      },
    )
    return !blockedByBooking
  })

  return Response.json(available)
}
