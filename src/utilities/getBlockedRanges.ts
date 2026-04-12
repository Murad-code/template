import type { Payload, PayloadRequest } from 'payload'
import type { BlockedDate } from '@/payload-types'

import { toDateOnlyString } from '@/utilities/dateOnly'

export type BlockedRange = {
  start: string
  end: string
  reason?: string | null
}

/**
 * Fetch blocked date ranges from the BlockedDates global.
 * Use in booking flows to exclude these ranges from available slots.
 */
export async function getBlockedRanges(payload: Payload, req?: PayloadRequest): Promise<BlockedRange[]> {
  const global = (await payload.findGlobal({
    slug: 'blocked-dates',
    depth: 0,
    ...(req && { req }),
  })) as BlockedDate | null

  const ranges = global?.ranges ?? []
  return ranges
    .filter((r): r is { start: string; end: string; reason?: string | null } => Boolean(r?.start && r?.end))
    .map((r) => ({
      start: toDateOnlyString(r.start as string | Date),
      end: toDateOnlyString(r.end as string | Date),
      reason: r.reason ?? null,
    }))
}

/**
 * Check if a given date (canonical `yyyy-mm-dd` string or Date) falls within any blocked range.
 */
export function isDateBlocked(date: string | Date, ranges: BlockedRange[]): boolean {
  const d = typeof date === 'string' ? toDateOnlyString(date) : toDateOnlyString(date)
  return ranges.some((r) => d >= r.start && d <= r.end)
}
