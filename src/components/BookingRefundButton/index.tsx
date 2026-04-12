'use client'

import { useDocumentInfo, useFormFields, Button } from '@payloadcms/ui'
import { useState } from 'react'

export function BookingRefundButton() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined)
  const amountPence = useFormFields(
    ([fields]) => (fields as { amount?: { value?: number | null } }).amount?.value as number | undefined | null,
  )
  const isRefunded = status === 'refunded'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [partialAmountPounds, setPartialAmountPounds] = useState<string>('')

  const totalPence = amountPence ?? 0
  const totalPounds = totalPence / 100
  const partialPounds = partialAmountPounds === '' ? null : parseFloat(partialAmountPounds)
  const isValidPartial =
    partialPounds !== null && !Number.isNaN(partialPounds) && partialPounds > 0 && partialPounds <= totalPounds
  const refundPence =
    partialPounds !== null && isValidPartial ? Math.round(partialPounds * 100) : totalPence

  const handleRefund = async () => {
    if (!id || loading) return
    const isPartial = refundPence > 0 && refundPence < totalPence
    const confirmMsg = isPartial
      ? `Refund £${(refundPence / 100).toFixed(2)} (partial)? This will call Stripe and update the booking.`
      : 'Refund this booking in full? This will call Stripe and update the booking status.'
    if (!confirm(confirmMsg)) return
    setLoading(true)
    setMessage(null)
    try {
      const body = isPartial ? { amount: refundPence } : {}
      const res = await fetch(`/api/bookings/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: (data as { error?: string }).error || `Error ${res.status}` })
        return
      }
      setMessage({ type: 'success', text: 'Refund processed. Refresh to see updated status.' })
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isRefunded ? (
        <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>Booking is refunded.</span>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label
              htmlFor="booking-refund-amount-input"
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--theme-elevation-800)' }}
            >
              Refund amount (£)
            </label>
            <input
              id="booking-refund-amount-input"
              type="number"
              min={0}
              max={totalPounds}
              step={0.01}
              placeholder={totalPounds > 0 ? totalPounds.toFixed(2) : '0.00'}
              value={partialAmountPounds}
              onChange={(e) => setPartialAmountPounds(e.target.value)}
              disabled={loading}
              style={{
                padding: '6px 8px',
                fontSize: 14,
                border: '1px solid var(--theme-elevation-400)',
                borderRadius: 4,
                backgroundColor: 'var(--theme-elevation-0)',
                color: 'var(--theme-text)',
                maxWidth: 140,
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>
              Leave empty for full refund. Max: £{totalPounds.toFixed(2)}
            </span>
          </div>
          <Button
            buttonStyle="primary"
            onClick={handleRefund}
            disabled={loading || totalPence <= 0 || (partialAmountPounds !== '' && !isValidPartial)}
          >
            {loading ? 'Refunding…' : refundPence < totalPence ? 'Refund partial amount' : 'Refund full amount'}
          </Button>
        </>
      )}
      {message && (
        <span
          style={{
            color: message.type === 'error' ? 'var(--theme-error-500)' : 'var(--theme-success-500)',
            fontSize: 12,
          }}
        >
          {message.text}
        </span>
      )}
    </div>
  )
}
