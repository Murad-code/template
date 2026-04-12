import type { CollectionAfterChangeHook } from 'payload'

/**
 * When a booking with a managed slot is cancelled, mark the oldest pending waitlist row as notified (template hook; extend with email as needed).
 */
export const notifyWaitlistOnCancel: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !req?.payload) return
  const prevStatus = (previousDoc as { status?: string } | undefined)?.status
  const nextStatus = (doc as { status?: string }).status
  if (prevStatus === 'cancelled' || nextStatus !== 'cancelled') return

  const slotOffering = (doc as { slotOffering?: number | { id: number } | null }).slotOffering
  const offeringId =
    typeof slotOffering === 'object' && slotOffering && 'id' in slotOffering
      ? slotOffering.id
      : slotOffering
  if (offeringId == null) return

  const { docs } = await req.payload.find({
    collection: 'booking-waitlist',
    where: {
      and: [
        { slotOffering: { equals: offeringId } },
        { status: { equals: 'pending' } },
      ],
    },
    sort: 'createdAt',
    limit: 1,
    depth: 0,
    req,
    overrideAccess: true,
  })

  const first = docs[0] as { id?: number } | undefined
  if (!first?.id) return

  await req.payload.update({
    collection: 'booking-waitlist',
    id: first.id,
    data: { status: 'notified' },
    req,
    overrideAccess: true,
  })
}
