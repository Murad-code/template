import { toDateOnlyString } from '@/utilities/dateOnly'

export type WeekdayHourRow = {
  weekday: number
  closed?: boolean | null
  startHour?: number | null
  endHour?: number | null
}

export type BookingHoursSettings = {
  defaultStartHour?: number | null
  defaultEndHour?: number | null
  weekdayHours?: WeekdayHourRow[] | null
}

/** `0` = Sunday … `6` = Saturday (matches `Date.prototype.getUTCDay`). */
export function getUtcWeekdayFromDateOnly(dateYmd: string): number {
  const ymd = toDateOnlyString(dateYmd)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return 0
  const d = new Date(`${ymd}T12:00:00.000Z`)
  return d.getUTCDay()
}

/**
 * Returns start/end hours in 0–23 for slot generation, or `closed: true`.
 * When `weekdayHours` has all 7 weekdays configured, those rows win; otherwise legacy defaults apply every day.
 */
export function getBookingHoursForDate(
  dateYmd: string,
  settings: BookingHoursSettings | null | undefined,
): { closed: true } | { closed: false; startHour: number; endHour: number } {
  const fallbackStart = settings?.defaultStartHour ?? 9
  const fallbackEnd = settings?.defaultEndHour ?? 17
  const rows = settings?.weekdayHours

  if (Array.isArray(rows) && rows.length === 7) {
    const w = getUtcWeekdayFromDateOnly(dateYmd)
    const row = rows.find((r) => Number(r.weekday) === w)
    if (row?.closed) return { closed: true }
    const start = row?.startHour ?? fallbackStart
    const end = row?.endHour ?? fallbackEnd
    if (start >= end) return { closed: true }
    return { closed: false, startHour: start, endHour: end }
  }

  if (fallbackStart >= fallbackEnd) return { closed: true }
  return { closed: false, startHour: fallbackStart, endHour: fallbackEnd }
}
