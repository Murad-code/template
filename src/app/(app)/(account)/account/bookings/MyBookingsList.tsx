import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { formatDateDisplayDMY } from '@/utilities/dateOnly'

type Row = {
  id: number
  slotDate: string
  slotTime: string
  status: string
  service?: { name?: string | null } | number | null
}

function serviceName(row: Row): string {
  const s = row.service
  if (s && typeof s === 'object' && s.name) return s.name
  return '—'
}

export function MyBookingsList({ bookings }: { bookings: Row[] }) {
  if (bookings.length === 0) {
    return <p className="text-muted-foreground">You have no bookings yet.</p>
  }

  return (
    <ul className="divide-y divide-border/60 rounded-md bg-card shadow-sm shadow-black/10 dark:shadow-black/40">
      {bookings.map((b) => (
        <li key={b.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{serviceName(b)}</p>
            <p className="text-sm text-muted-foreground">
              {formatDateDisplayDMY(b.slotDate)} at {b.slotTime}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <span className="text-sm capitalize text-muted-foreground">{b.status}</span>
            <Button asChild variant="outline" size="sm">
              <Link href={`/bookings/${b.id}`}>View</Link>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
