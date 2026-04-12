import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'

/**
 * GET /api/booking/calendar-settings
 * Public subset of Booking settings for the booking calendar (closed weekdays, etc.).
 */
export async function GET(): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const s = await payload.findGlobal({ slug: 'booking-settings', depth: 0 })

  const doc = s as {
    defaultStartHour?: number | null
    defaultEndHour?: number | null
    weekdayHours?: unknown
  }

  return Response.json({
    defaultStartHour: doc.defaultStartHour ?? 9,
    defaultEndHour: doc.defaultEndHour ?? 17,
    weekdayHours: Array.isArray(doc.weekdayHours) ? doc.weekdayHours : null,
  })
}
