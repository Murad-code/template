import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getBlockedRanges } from '@/utilities/getBlockedRanges'

/**
 * Public API: returns blocked date ranges for use in booking UIs.
 * When ENABLE_BOOKING is true, the booking flow should exclude these ranges from available slots.
 */
export async function GET(): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const ranges = await getBlockedRanges(payload)
  return Response.json(ranges)
}
