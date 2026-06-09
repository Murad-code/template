'use client'

import { endOfDay, startOfDay } from 'date-fns'
import { useMemo } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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

  const selectedDate = selected ? dayjs(parseLocalDay(selected)) : null

  const shouldDisableDate = (value: Dayjs) => {
    const date = startOfDay(value.toDate())
    if (date < startOfDay(new Date())) return true

    const isBlockedRange = blockedDateRanges.some((range) => date >= range.from && date <= range.to)
    if (isBlockedRange) return true

    if (bookingHoursSettings) {
      const iso = localDateToYmd(date)
      return getBookingHoursForDate(iso, bookingHoursSettings).closed
    }

    return false
  }

  return (
    <div className="booking-calendar w-fit rounded-md bg-background p-3 shadow-sm shadow-black/5 dark:shadow-black/20">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={(value) => {
            if (!value) return
            onSelect(localDateToYmd(value.toDate()))
          }}
          shouldDisableDate={shouldDisableDate}
          slotProps={{
            day: {
              sx: {
                color: 'var(--foreground)',
                borderRadius: '9999px',
                border: 0,
                transition: 'background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease',
                '&:not(.Mui-selected):hover': {
                  backgroundColor: 'color-mix(in srgb, var(--border) 22%, var(--card))',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--landing-card-border) !important',
                  color: 'var(--landing-heading) !important',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.14)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'var(--landing-card-border) !important',
                },
              },
            },
          }}
          sx={{
            '& .MuiPickersCalendarHeader-label': {
              color: 'var(--foreground)',
              fontWeight: 600,
            },
            '& .MuiDayCalendar-weekDayLabel': {
              color: 'var(--muted-foreground)',
              fontSize: '0.75rem',
            },
            '& .MuiPickersArrowSwitcher-button': {
              color: 'var(--foreground)',
            },
          }}
        />
      </LocalizationProvider>
    </div>
  )
}
