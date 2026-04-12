import type { Payload } from 'payload'

import { toDateOnlyString } from '@/utilities/dateOnly'

export type SlotOfferingDoc = {
  id: number
  active?: boolean | null
  service?: number | { id: number } | null
  slotDate?: string | null
  slotTime?: string | null
  capacity?: number | null
}

export async function countActiveBookingsOnSlotOffering(
  payload: Payload,
  slotOfferingId: string | number,
): Promise<number> {
  const { totalDocs } = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { slotOffering: { equals: slotOfferingId } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    limit: 0,
    depth: 0,
  })
  return totalDocs
}

/**
 * Returns an error message if invalid or full; otherwise `null`.
 */
export async function validateSlotOfferingForBooking(
  payload: Payload,
  args: {
    slotOfferingId: string | number
    serviceId: string | number
    slotDate: string
    slotTime: string
  },
): Promise<string | null> {
  const { slotOfferingId, serviceId, slotDate, slotTime } = args
  const doc = (await payload
    .findByID({
      collection: 'booking-slots',
      id: typeof slotOfferingId === 'string' ? slotOfferingId : String(slotOfferingId),
      depth: 0,
    })
    .catch(() => null)) as SlotOfferingDoc | null

  if (!doc || !doc.active) return 'Invalid or inactive slot'

  const svc = typeof doc.service === 'object' && doc.service ? doc.service.id : doc.service
  if (String(svc) !== String(serviceId)) return 'Slot does not match service'

  const docDate = toDateOnlyString(doc.slotDate as string | Date | null | undefined)
  if (docDate !== toDateOnlyString(slotDate)) return 'Slot does not match date'

  if (String(doc.slotTime ?? '').trim() !== String(slotTime).trim()) return 'Slot does not match time'

  const cap = typeof doc.capacity === 'number' && doc.capacity > 0 ? doc.capacity : 1
  const used = await countActiveBookingsOnSlotOffering(payload, doc.id)
  if (used >= cap) return 'This slot is fully booked'

  return null
}
