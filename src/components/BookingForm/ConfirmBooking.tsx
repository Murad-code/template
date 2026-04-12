'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * After Stripe redirect (3DS), finalize the booking from payment_intent and go to the invoice page.
 */
export function ConfirmBooking() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ran = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')
    const email = searchParams.get('email')?.trim() ?? ''

    if (!paymentIntentId) {
      router.replace('/book')
      return
    }

    if (redirectStatus !== 'succeeded') {
      setError('Payment was not completed.')
      return
    }

    if (ran.current) return
    ran.current = true

    void (async () => {
      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId }),
        })
        const data = (await res.json()) as {
          success?: boolean
          id?: number
          accessToken?: string
          error?: string
        }
        if (!res.ok || !data.success || data.id == null) {
          setError(data.error || 'Could not complete booking.')
          return
        }

        const qp = new URLSearchParams()
        if (email) qp.set('email', email)
        if (data.accessToken) qp.set('accessToken', data.accessToken)
        const qs = qp.toString()
        router.replace(`/bookings/${data.id}${qs ? `?${qs}` : ''}`)
      } catch {
        setError('Request failed.')
      }
    })()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="text-center w-full flex flex-col items-center justify-start gap-4 max-w-md mx-auto">
        <h1 className="text-2xl">Booking</h1>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="text-center w-full flex flex-col items-center justify-start gap-4">
      <h1 className="text-2xl">Confirming booking</h1>
      <LoadingSpinner className="w-12 h-6" />
    </div>
  )
}
