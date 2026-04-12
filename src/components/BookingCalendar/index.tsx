'use client'

import { useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import { endOfDay, startOfDay } from 'date-fns'

import type { BlockedRange } from '@/utilities/getBlockedRanges'

import 'react-day-picker/dist/style.css'

type Props = {
  selected: string
  onSelect: (isoDate: string) => void
  blockedRanges: BlockedRange[]
}

function parseLocalDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function BookingCalendar({ selected, onSelect, blockedRanges }: Props) {
  const disabledMatchers = useMemo(() => {
    const matchers: Array<{ before: Date } | { from: Date; to: Date }> = [
      { before: startOfDay(new Date()) },
    ]
    for (const r of blockedRanges) {
      if (!r.start || !r.end) continue
      const from = startOfDay(parseLocalDay(r.start))
      const to = endOfDay(parseLocalDay(r.end))
      matchers.push({ from, to })
    }
    return matchers
  }, [blockedRanges])

  const selectedDate = selected ? parseLocalDay(selected) : undefined

  return (
    <div className="booking-calendar [&_.rdp]:m-0 [&_.rdp-button]:rounded-md">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (!date) return
          const y = date.getFullYear()
          const mo = date.getMonth() + 1
          const da = date.getDate()
          const iso = `${y}-${mo < 10 ? '0' : ''}${mo}-${da < 10 ? '0' : ''}${da}`
          onSelect(iso)
        }}
        disabled={disabledMatchers}
        weekStartsOn={1}
        className="rounded-md border border-border p-3"
      />
    </div>
  )
}
