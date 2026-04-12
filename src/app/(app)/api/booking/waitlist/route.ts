import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'
import { toDateOnlyString } from '@/utilities/dateOnly'
import { countActiveBookingsOnSlotOffering, validateSlotOfferingForBooking } from '@/utilities/bookingSlotOffering'

export async function POST(request: Request): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json().catch(() => ({}))
  const { serviceId, slotDate: rawDate, slotTime, guestEmail, guestName, slotOfferingId: rawOffering } = body
  if (!serviceId || !rawDate || !guestEmail) {
    return new Response(JSON.stringify({ error: 'Missing serviceId, slotDate, or guestEmail' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const slotDate = toDateOnlyString(String(rawDate))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate)) {
    return new Response(JSON.stringify({ error: 'Invalid slotDate' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const slotOfferingId =
    rawOffering != null && rawOffering !== '' ? Number(rawOffering) : undefined
  if (rawOffering != null && rawOffering !== '' && Number.isNaN(slotOfferingId)) {
    return new Response(JSON.stringify({ error: 'Invalid slotOfferingId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const slotTimeStr = typeof slotTime === 'string' ? slotTime.trim() : ''
  if (slotOfferingId != null && !slotTimeStr) {
    return new Response(JSON.stringify({ error: 'slotTime is required for a managed slot waitlist' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const service = await payload
    .findByID({
      collection: 'services',
      id: typeof serviceId === 'string' ? serviceId : String(serviceId),
      depth: 0,
    })
    .catch(() => null)

  if (!service || !(service as { active?: boolean }).active) {
    return new Response(JSON.stringify({ error: 'Invalid or inactive service' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (slotOfferingId != null) {
    const v = await validateSlotOfferingForBooking(payload, {
      slotOfferingId,
      serviceId: String(serviceId),
      slotDate,
      slotTime: slotTimeStr,
    })
    if (v && v !== 'This slot is fully booked') {
      return new Response(JSON.stringify({ error: v }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const used = await countActiveBookingsOnSlotOffering(payload, slotOfferingId)
    const doc = (await payload
      .findByID({ collection: 'booking-slots', id: String(slotOfferingId), depth: 0 })
      .catch(() => null)) as { capacity?: number } | null
    const cap = doc?.capacity != null && doc.capacity > 0 ? doc.capacity : 1
    if (used < cap) {
      return new Response(JSON.stringify({ error: 'This slot is not full; book normally instead.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  await payload.create({
    collection: 'booking-waitlist',
    data: {
      service: (service as { id: number }).id,
      slotDate,
      slotTime: slotTimeStr || '—',
      guestEmail: String(guestEmail).trim(),
      guestName: typeof guestName === 'string' ? guestName.trim() || undefined : undefined,
      ...(slotOfferingId != null ? { slotOffering: slotOfferingId } : {}),
      status: 'pending',
    },
  })

  return Response.json({ success: true })
}
