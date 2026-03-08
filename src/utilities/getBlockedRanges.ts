import type { PayloadRequest } from 'payload'
import type { BlockedDate } from '@/payload-types'

export type BlockedRange = {
  start: string
  end: string
  reason?: string | null
}

/**
 * Fetch blocked date ranges from the BlockedDates global.
 * Use in booking flows to exclude these ranges from available slots.
 */
export async function getBlockedRanges(payload: { getGlobal: (args: unknown) => Promise<unknown> }, req?: PayloadRequest): Promise<BlockedRange[]> {
  const global = await payload.getGlobal({
    slug: 'blocked-dates',
    ...(req && { req }),
  }) as BlockedDate | null

  const ranges = global?.ranges ?? []
  return ranges
    .filter((r): r is { start: string; end: string; reason?: string | null } => Boolean(r?.start && r?.end))
    .map((r) => ({
      start: typeof r.start === 'string' ? r.start : new Date(r.start).toISOString().slice(0, 10),
      end: typeof r.end === 'string' ? r.end : new Date(r.end).toISOString().slice(0, 10),
      reason: r.reason ?? null,
    }))
}

/**
 * Check if a given date (YYYY-MM-DD or Date) falls within any blocked range.
 */
export function isDateBlocked(date: string | Date, ranges: BlockedRange[]): boolean {
  const d = typeof date === 'string' ? date : date.toISOString().slice(0, 10)
  return ranges.some((r) => d >= r.start && d <= r.end)
}
