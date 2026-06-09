'use client'

import { BookingCalendar } from '@/components/BookingCalendar'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BlockedRange } from '@/utilities/getBlockedRanges'
import type { BookingHoursSettings } from '@/utilities/getBookingHoursForDate'
import { getBookingHoursForDate } from '@/utilities/getBookingHoursForDate'
import { getServerSideURL } from '@/utilities/getURL'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
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

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

type ServiceOption = {
  id: string | number
  slug?: string
  name: string
  durationMinutes: number
  description?: string
  priceInGBPEnabled?: boolean
  priceInGBP?: number | null
}

type SlotRow = { time: string; slotOfferingId?: number }

export type BookingFormProps = {
  initialServiceSlugOrId?: string | null
  initialProductId?: string | null
}

export function BookingForm({
  initialServiceSlugOrId = null,
  initialProductId: _initialProductId = null,
}: BookingFormProps = {}) {
  const router = useRouter()
  const [services, setServices] = useState<ServiceOption[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<SlotRow[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [selectedSlotOfferingId, setSelectedSlotOfferingId] = useState<number | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null)
  const [bookingHoursSettings, setBookingHoursSettings] = useState<BookingHoursSettings | null>(
    null,
  )

  const bookingSelectionRef = useRef({ date: '', serviceId: '', slot: '' })
  bookingSelectionRef.current = {
    date,
    serviceId: selectedServiceId,
    slot: selectedSlot,
  }

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
    if (!initialServiceSlugOrId || services.length === 0) return
    const match = services.find(
      (s) =>
        String(s.id) === initialServiceSlugOrId ||
        (s.slug != null && s.slug === initialServiceSlugOrId),
    )
    if (match) setSelectedServiceId(String(match.id))
  }, [initialServiceSlugOrId, services])

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((res) => res.json())
      .then((data) => (Array.isArray(data) ? setBlockedRanges(data) : setBlockedRanges([])))
      .catch(() => setBlockedRanges([]))
  }, [])

  useEffect(() => {
    fetch('/api/booking/calendar-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (!data || typeof data !== 'object') {
          setBookingHoursSettings(null)
          return
        }
        const o = data as Record<string, unknown>
        setBookingHoursSettings({
          defaultStartHour: typeof o.defaultStartHour === 'number' ? o.defaultStartHour : undefined,
          defaultEndHour: typeof o.defaultEndHour === 'number' ? o.defaultEndHour : undefined,
          weekdayHours: Array.isArray(o.weekdayHours)
            ? (o.weekdayHours as BookingHoursSettings['weekdayHours'])
            : null,
        })
      })
      .catch(() => setBookingHoursSettings(null))
  }, [])

  useEffect(() => {
    if (!date || !bookingHoursSettings) return
    if (getBookingHoursForDate(date, bookingHoursSettings).closed) {
      setDate('')
      setSlots([])
      setSelectedSlot('')
      setSelectedSlotOfferingId(null)
    }
  }, [bookingHoursSettings, date])

  const fetchSlots = async () => {
    if (!date || !selectedServiceId) return
    setLoadingSlots(true)
    setSlots([])
    setSelectedSlot('')
    setSelectedSlotOfferingId(null)
    setMessage(null)
    try {
      const params = new URLSearchParams({ date, serviceId: selectedServiceId })
      const res = await fetch(`/api/booking/slots?${params}`)
      const data = await res.json()
      if (!Array.isArray(data)) {
        setSlots([])
        return
      }
      const normalized: SlotRow[] = data.map((item: unknown) => {
        if (typeof item === 'string') return { time: item }
        if (item && typeof item === 'object' && 'time' in item) {
          const o = item as { time: string; slotOfferingId?: number }
          return {
            time: String(o.time),
            ...(typeof o.slotOfferingId === 'number' ? { slotOfferingId: o.slotOfferingId } : {}),
          }
        }
        return { time: '' }
      })
      setSlots(normalized.filter((s) => s.time.length > 0))
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    if (date && selectedServiceId) fetchSlots()
  }, [date, selectedServiceId])

  /** Stripe PI metadata is fixed at creation — clear so a date/slot change cannot reuse an old intent (wrong day after 3DS). */
  useEffect(() => {
    setPaymentClientSecret(null)
    setPaymentAmount(null)
  }, [date, selectedServiceId, selectedSlot])

  const selectedService = services.find((s) => String(s.id) === selectedServiceId)
  const showServiceSelect = !initialServiceSlugOrId
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
          if (data.id != null && data.accessToken) {
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
            ...(selectedSlotOfferingId != null ? { slotOfferingId: selectedSlotOfferingId } : {}),
            ...(paymentIntentId ? { paymentIntentId } : {}),
          }),
        })
        const data = (await res.json()) as BookingApiResponse
        if (!res.ok) {
          setMessage({ type: 'error', text: data.error || 'Booking failed' })
          return
        }
        if (data.id != null && data.accessToken) {
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
    [router, selectedServiceId, date, selectedSlot, selectedSlotOfferingId, guestEmail, guestName],
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
      setMessage({ type: 'error', text: 'Please choose a date, time, and enter your email.' })
      return false
    }
    return true
  }

  const startPaymentIntent = async () => {
    if (!validateStep()) return
    if (!hasPrice || !stripeKey) return
    setMessage(null)
    setSubmitting(true)
    const requested = {
      date,
      serviceId: selectedServiceId,
      slot: selectedSlot,
    }
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
          ...(selectedSlotOfferingId != null ? { slotOfferingId: selectedSlotOfferingId } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Could not start payment' })
        return
      }
      const latest = bookingSelectionRef.current
      if (
        latest.date !== requested.date ||
        latest.serviceId !== requested.serviceId ||
        latest.slot !== requested.slot
      ) {
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
    <div className="space-y-6 w-full">
      {showServiceSelect ? (
        <div>
          <Label htmlFor="service">Service</Label>
          <select
            id="service"
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(e.target.value)
              setSlots([])
              setSelectedSlot('')
              setSelectedSlotOfferingId(null)
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
      ) : null}
      <div>
        <Label>Date</Label>
        <div className="mt-2">
          <BookingCalendar
            selected={date}
            onSelect={(d) => setDate(d)}
            blockedRanges={blockedRanges}
            bookingHoursSettings={bookingHoursSettings}
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
                  key={`${slot.time}-${slot.slotOfferingId ?? 'g'}`}
                  type="button"
                  onClick={() => {
                    setSelectedSlot(slot.time)
                    setSelectedSlotOfferingId(
                      typeof slot.slotOfferingId === 'number' ? slot.slotOfferingId : null,
                    )
                  }}
                  className={`booking-slot-button px-3 py-1.5 rounded text-sm cursor-pointer ${
                    selectedSlot === slot.time &&
                    (slot.slotOfferingId ?? null) === selectedSlotOfferingId
                      ? 'booking-slot-button--selected'
                      : ''
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="guestEmail">Email *</Label>
        <Input
          id="guestEmail"
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
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
              Pay <Price amount={selectedService.priceInGBP} as="span" className="font-medium" />{' '}
              and book
            </span>
          ) : (
            'Request booking'
          )}
        </Button>
      )}
    </div>
  )
}
