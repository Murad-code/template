'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { formatDateDisplayDMY } from '@/utilities/dateOnly'

type Preview = { id: number; serviceName: string; slotDate: string; slotTime: string }

function CancelContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Missing cancel link. Use the link from your confirmation email.')
      setLoading(false)
      return
    }
    fetch(`/api/booking/cancel-preview?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setPreview(data)
      })
      .catch(() => setError('Could not load booking.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleCancel = async () => {
    if (!token || !preview) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/booking/${preview.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to cancel')
        return
      }
      setDone(true)
    } catch {
      setError('Request failed')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>
  }
  if (error && !preview) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{error}</p>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    )
  }
  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-green-600 dark:text-green-400">Your booking has been cancelled.</p>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    )
  }
  if (!preview) return null

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-medium">Cancel booking</h1>
      <p className="text-muted-foreground">
        {preview.serviceName} — {formatDateDisplayDMY(preview.slotDate)} at {preview.slotTime}
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href="/">Keep booking</Link>
        </Button>
        <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? 'Cancelling…' : 'Cancel booking'}
        </Button>
      </div>
    </div>
  )
}

export default function CancelBookingPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <CancelContent />
      </Suspense>
    </div>
  )
}
