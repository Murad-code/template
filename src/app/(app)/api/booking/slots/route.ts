import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getBlockedRanges, isDateBlocked } from '@/utilities/getBlockedRanges'
import { getSiteConfig } from '@/config/site'
import { toDateOnlyString } from '@/utilities/dateOnly'
import { getBookingHoursForDate } from '@/utilities/getBookingHoursForDate'
import { countActiveBookingsOnSlotOffering } from '@/utilities/bookingSlotOffering'

export type SlotOptionJson = { time: string; slotOfferingId?: number }

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
    return Response.json([] as SlotOptionJson[])
  }

  const slotDuration =
    (service as { durationMinutes?: number } | null)?.durationMinutes ??
    (settings as { slotDurationMinutes?: number })?.slotDurationMinutes ??
    30

  if (serviceId) {
    const { docs: managed } = await payload.find({
      collection: 'booking-slots',
      where: {
        and: [
          { service: { equals: serviceId } },
          { slotDate: { equals: date } },
          { active: { equals: true } },
        ],
      },
      depth: 0,
      limit: 200,
      sort: 'slotTime',
    })

    if (managed.length > 0) {
      const out: SlotOptionJson[] = []
      for (const row of managed) {
        const id = (row as { id: number }).id
        const time = String((row as { slotTime?: string }).slotTime ?? '').trim()
        if (!time) continue
        const cap = (row as { capacity?: number }).capacity ?? 1
        const used = await countActiveBookingsOnSlotOffering(payload, id)
        if (used < cap) {
          out.push({ time, slotOfferingId: id })
        }
      }
      return Response.json(out)
    }
  }

  const dayHours = getBookingHoursForDate(date, settings as Parameters<typeof getBookingHoursForDate>[1])
  if (dayHours.closed) {
    return Response.json([] as SlotOptionJson[])
  }
  const { startHour, endHour } = dayHours

  const startMins = startHour * 60
  const endMins = endHour * 60
  const generated: string[] = []
  for (let mins = startMins; mins + slotDuration <= endMins; mins += slotDuration) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    generated.push(`${pad(h)}:${pad(m)}`)
  }

  const { docs: existing } = await payload.find({
    collection: 'bookings',
    where: {
      and: [{ slotDate: { equals: date } }, { status: { not_equals: 'cancelled' } }],
    },
    depth: 1,
    limit: 500,
  })

  const available = generated.filter((slot) => {
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

  return Response.json(available.map((time) => ({ time })) satisfies SlotOptionJson[])
}
