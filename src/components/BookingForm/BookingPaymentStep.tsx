'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { Button } from '@/components/ui/button'

type Props = {
  amountPence: number | null
  onSuccess: (paymentIntentId: string) => void
  onCancel: () => void
  /** Stripe return URL after 3DS (e.g. `/book/confirm?email=…`). Defaults to current page. */
  returnUrl?: string
}

export function BookingPaymentStep({ amountPence, onSuccess, onCancel, returnUrl }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Payment failed')
      setProcessing(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          returnUrl ?? (typeof window !== 'undefined' ? window.location.href : '/'),
      },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed')
      setProcessing(false)
      return
    }

    if (paymentIntent?.status === 'succeeded' && paymentIntent.id) {
      onSuccess(paymentIntent.id)
    } else {
      setError('Payment was not completed')
    }
    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {amountPence != null && (
        <p className="text-sm text-muted-foreground">
          Total: £{(amountPence / 100).toFixed(2)}
        </p>
      )}
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
          Back
        </Button>
        <Button type="submit" disabled={processing || !stripe}>
          {processing ? 'Processing…' : 'Pay and confirm'}
        </Button>
      </div>
    </form>
  )
}
