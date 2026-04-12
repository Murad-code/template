'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookingCalendar } from '@/components/BookingCalendar'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Price } from '@/components/Price'
import type { BlockedRange } from '@/utilities/getBlockedRanges'
import { getServerSideURL } from '@/utilities/getURL'
import { BookingPaymentStep } from './BookingPaymentStep'

type BookingApiResponse = {
  success?: boolean
  id?: number
  accessToken?: string
  guestEmail?: string
  error?: string
}

function pushBookingInvoice(
  router: ReturnType<typeof useRouter>,
  data: { id: number; accessToken?: string; guestEmail?: string },
) {
  if (!data.accessToken) return
  const qp = new URLSearchParams()
  if (data.guestEmail) qp.set('email', data.guestEmail)
  qp.set('accessToken', data.accessToken)
  router.push(`/bookings/${data.id}?${qp.toString()}`)
}

const stripePromise =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null

type ServiceOption = {
  id: string | number
  name: string
  durationMinutes: number
  description?: string
  priceInGBPEnabled?: boolean
  priceInGBP?: number | null
}

export function BookingForm() {
  const router = useRouter()
  const [services, setServices] = useState<ServiceOption[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/booking/services')
      .then((res) => res.json())
      .then((data: ServiceOption[]) => {
        if (Array.isArray(data)) {
          setServices(data)
          if (data.length === 1) setSelectedServiceId(String(data[0].id))
        }
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false))
  }, [])

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setBlockedRanges(data) : setBlockedRanges([])))
      .catch(() => setBlockedRanges([]))
  }, [])

  const fetchSlots = async () => {
    if (!date || !selectedServiceId) return
    setLoadingSlots(true)
    setSlots([])
    setSelectedSlot('')
    setMessage(null)
    try {
      const params = new URLSearchParams({ date, serviceId: selectedServiceId })
      const res = await fetch(`/api/booking/slots?${params}`)
      const data = await res.json()
      if (Array.isArray(data)) setSlots(data)
      else setSlots([])
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    if (date && selectedServiceId) fetchSlots()
  }, [date, selectedServiceId])

  const selectedService = services.find((s) => String(s.id) === selectedServiceId)
  const hasPrice = Boolean(
    selectedService?.priceInGBPEnabled &&
      selectedService.priceInGBP != null &&
      selectedService.priceInGBP > 0,
  )
  const stripeKey = typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'string'

  const submitBooking = useCallback(
    async (paymentIntentId?: string, opts?: { stripeReturnOnly?: boolean }) => {
      if (opts?.stripeReturnOnly && paymentIntentId) {
        setSubmitting(true)
        setMessage(null)
        try {
          const res = await fetch('/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId }),
          })
          const data = (await res.json()) as BookingApiResponse
          if (!res.ok) {
            setMessage({ type: 'error', text: data.error || 'Booking failed' })
            return
          }
          if (paymentIntentId && data.id != null && data.accessToken) {
            pushBookingInvoice(router, {
              id: data.id,
              accessToken: data.accessToken,
              guestEmail: data.guestEmail,
            })
            return
          }
          setMessage({ type: 'success', text: 'Booking requested. We’ll confirm shortly.' })
          setSelectedSlot('')
          setGuestEmail('')
          setGuestName('')
          setPaymentClientSecret(null)
          setPaymentAmount(null)
        } catch {
          setMessage({ type: 'error', text: 'Request failed' })
        } finally {
          setSubmitting(false)
        }
        return
      }

      if (!selectedServiceId || !date || !selectedSlot || !guestEmail) return
      setSubmitting(true)
      setMessage(null)
      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: selectedServiceId,
            guestEmail,
            guestName: guestName || undefined,
            slotDate: date,
            slotTime: selectedSlot,
            ...(paymentIntentId ? { paymentIntentId } : {}),
          }),
        })
        const data = (await res.json()) as BookingApiResponse
        if (!res.ok) {
          setMessage({ type: 'error', text: data.error || 'Booking failed' })
          return
        }
        if (paymentIntentId && data.id != null && data.accessToken) {
          pushBookingInvoice(router, {
            id: data.id,
            accessToken: data.accessToken,
            guestEmail: data.guestEmail ?? guestEmail,
          })
          setSelectedSlot('')
          setGuestEmail('')
          setGuestName('')
          setPaymentClientSecret(null)
          setPaymentAmount(null)
          fetchSlots()
          return
        }
        setMessage({ type: 'success', text: 'Booking requested. We’ll confirm shortly.' })
        setSelectedSlot('')
        setGuestEmail('')
        setGuestName('')
        setPaymentClientSecret(null)
        setPaymentAmount(null)
        fetchSlots()
      } catch {
        setMessage({ type: 'error', text: 'Request failed' })
      } finally {
        setSubmitting(false)
      }
    },
    [router, selectedServiceId, date, selectedSlot, guestEmail, guestName],
  )

  /** After Stripe 3DS redirect, URL contains payment_intent + redirect_status (form state is empty). */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const pi = url.searchParams.get('payment_intent')
    const status = url.searchParams.get('redirect_status')
    if (!pi || status !== 'succeeded') return

    url.searchParams.delete('payment_intent')
    url.searchParams.delete('payment_intent_client_secret')
    url.searchParams.delete('redirect_status')
    const qs = url.searchParams.toString()
    window.history.replaceState({}, '', url.pathname + (qs ? `?${qs}` : ''))

    void submitBooking(pi, { stripeReturnOnly: true })
  }, [submitBooking])

  const validateStep = () => {
    if (!selectedServiceId || !date || !selectedSlot || !guestEmail) {
      setMessage({ type: 'error', text: 'Please choose a service, date, time, and enter your email.' })
      return false
    }
    return true
  }

  const startPaymentIntent = async () => {
    if (!validateStep()) return
    if (!hasPrice || !stripeKey) return
    setMessage(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/booking/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          slotDate: date,
          slotTime: selectedSlot,
          guestEmail,
          guestName: guestName || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Could not start payment' })
        return
      }
      setPaymentClientSecret(data.clientSecret)
      setPaymentAmount(data.amount ?? null)
    } catch {
      setMessage({ type: 'error', text: 'Request failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const requestFreeBooking = () => {
    if (!validateStep()) return
    void submitBooking()
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    void submitBooking(paymentIntentId)
  }

  const baseUrl = getServerSideURL().replace(/\/$/, '')
  const paymentReturnUrl =
    guestEmail.trim().length > 0
      ? `${baseUrl}/book/confirm?email=${encodeURIComponent(guestEmail.trim())}`
      : undefined

  if (loadingServices) {
    return <p className="text-muted-foreground">Loading services…</p>
  }
  if (services.length === 0) {
    return (
      <p className="text-muted-foreground">
        No bookable services are set up yet. Add services in the admin to enable booking.
      </p>
    )
  }

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="service">Service</Label>
        <select
          id="service"
          value={selectedServiceId}
          onChange={(e) => {
            setSelectedServiceId(e.target.value)
            setSlots([])
            setSelectedSlot('')
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={String(s.id)} value={String(s.id)}>
              {s.name} ({s.durationMinutes} min)
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Date</Label>
        <div className="mt-2">
          <BookingCalendar
            selected={date}
            onSelect={(d) => setDate(d)}
            blockedRanges={blockedRanges}
          />
        </div>
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
      {paymentClientSecret && stripePromise ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentClientSecret,
            appearance: { theme: 'stripe' },
          }}
        >
          <BookingPaymentStep
            amountPence={paymentAmount}
            returnUrl={paymentReturnUrl}
            onSuccess={handlePaymentSuccess}
            onCancel={() => {
              setPaymentClientSecret(null)
              setPaymentAmount(null)
              setSubmitting(false)
            }}
          />
        </Elements>
      ) : (
        <Button
          type="button"
          disabled={submitting || !selectedServiceId || !selectedSlot}
          onClick={() => {
            if (hasPrice && stripeKey) void startPaymentIntent()
            else void requestFreeBooking()
          }}
        >
          {submitting ? (
            'Loading…'
          ) : hasPrice && stripeKey && selectedService?.priceInGBP != null ? (
            <span className="inline-flex flex-wrap items-center gap-x-1 justify-center">
              Pay <Price amount={selectedService.priceInGBP} as="span" className="font-medium" /> and book
            </span>
          ) : (
            'Request booking'
          )}
        </Button>
      )}
    </div>
  )
}
