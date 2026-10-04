'use client'

import { endOfDay, startOfDay } from 'date-fns'
import { useMemo } from 'react'

import { Calendar } from '@/components/ui/calendar'
import type { BlockedRange } from '@/utilities/getBlockedRanges'
import {
  getBookingHoursForDate,
  type BookingHoursSettings,
} from '@/utilities/getBookingHoursForDate'

type Props = {
  selected: string
  onSelect: (isoDate: string) => void
  blockedRanges: BlockedRange[]
  /** When set (e.g. seven weekday rows with some closed), those calendar days are not selectable. */
  bookingHoursSettings?: BookingHoursSettings | null
}

function parseLocalDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function localDateToYmd(date: Date): string {
  const y = date.getFullYear()
  const mo = date.getMonth() + 1
  const da = date.getDate()
  return `${y}-${mo < 10 ? '0' : ''}${mo}-${da < 10 ? '0' : ''}${da}`
}

export function BookingCalendar({
  selected,
  onSelect,
  blockedRanges,
  bookingHoursSettings = null,
}: Props) {
  const blockedDateRanges = useMemo(() => {
    return blockedRanges
      .filter((r) => r.start && r.end)
      .map((r) => ({
        from: startOfDay(parseLocalDay(r.start)),
        to: endOfDay(parseLocalDay(r.end)),
      }))
  }, [blockedRanges])

  const selectedDate = selected ? parseLocalDay(selected) : undefined

  const isDisabled = (value: Date) => {
    const date = startOfDay(value)
    if (date < startOfDay(new Date())) return true

    const isBlockedRange = blockedDateRanges.some((range) => date >= range.from && date <= range.to)
    if (isBlockedRange) return true

    if (bookingHoursSettings) {
      return getBookingHoursForDate(localDateToYmd(date), bookingHoursSettings).closed
    }

    return false
  }

  return (
    <Calendar
      className="border-border bg-background rounded-lg border p-3"
      disabled={isDisabled}
      mode="single"
      onSelect={(value) => {
        if (!value) return
        onSelect(localDateToYmd(value))
      }}
      selected={selectedDate}
      // Nobody books a session in the past, so the calendar should not offer
      // to navigate there either.
      startMonth={startOfDay(new Date())}
    />
  )
}
