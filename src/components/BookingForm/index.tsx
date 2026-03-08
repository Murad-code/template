'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BookingForm() {
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchSlots = async () => {
    if (!date) return
    setLoadingSlots(true)
    setSlots([])
    setSelectedSlot('')
    setMessage(null)
    try {
      const res = await fetch(`/api/booking/slots?date=${encodeURIComponent(date)}`)
      const data = await res.json()
      if (Array.isArray(data)) setSlots(data)
      else setSlots([])
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !selectedSlot || !guestEmail) {
      setMessage({ type: 'error', text: 'Please choose a date, time, and enter your email.' })
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail,
          guestName: guestName || undefined,
          slotDate: date,
          slotTime: selectedSlot,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Booking failed' })
        return
      }
      setMessage({ type: 'success', text: 'Booking requested. We’ll confirm shortly.' })
      setSelectedSlot('')
      setGuestEmail('')
      setGuestName('')
      fetchSlots()
    } catch {
      setMessage({ type: 'error', text: 'Request failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onBlur={fetchSlots}
          min={new Date().toISOString().slice(0, 10)}
        />
      </div>
      {date && (
        <div>
          <Label>Available times</Label>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground mt-2">Loading…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">No slots available for this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1.5 rounded text-sm border ${
                    selectedSlot === slot
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="guestEmail">Email *</Label>
        <Input
          id="guestEmail"
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="guestName">Name</Label>
        <Input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === 'error' ? 'text-destructive' : 'text-green-600 dark:text-green-400'
          }`}
        >
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={submitting || !selectedSlot}>
        {submitting ? 'Submitting…' : 'Request booking'}
      </Button>
    </form>
  )
}
