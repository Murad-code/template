'use client'

import { useDocumentInfo, useFormFields, Button } from '@payloadcms/ui'
import { useState } from 'react'

export function OrderRefundButton() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined)
  const orderAmountPence = useFormFields(
    ([fields]) => (fields as { amount?: { value?: number | null } }).amount?.value as number | undefined | null,
  )
  const isRefunded = status === 'refunded'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [partialAmountPounds, setPartialAmountPounds] = useState<string>('')

  const orderTotalPence = orderAmountPence ?? 0
  const orderTotalPounds = orderTotalPence / 100
  const partialPounds = partialAmountPounds === '' ? null : parseFloat(partialAmountPounds)
  const isValidPartial =
    partialPounds !== null && !Number.isNaN(partialPounds) && partialPounds > 0 && partialPounds <= orderTotalPounds
  const refundPence =
    partialPounds !== null && isValidPartial ? Math.round(partialPounds * 100) : orderTotalPence

  const handleRefund = async () => {
    if (!id || loading) return
    const isPartial = refundPence > 0 && refundPence < orderTotalPence
    const confirmMsg = isPartial
      ? `Refund £${(refundPence / 100).toFixed(2)} (partial)? This will call Stripe and update the order.`
      : 'Refund this order in full? This will call Stripe and update the order status.'
    if (!confirm(confirmMsg)) return
    setLoading(true)
    setMessage(null)
    try {
      const body = isPartial ? { amount: refundPence } : {}
      const res = await fetch(`/api/orders/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || `Error ${res.status}` })
        return
      }
      setMessage({ type: 'success', text: 'Order refunded successfully. Refresh to see updated status.' })
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isRefunded ? (
        <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>Order is refunded.</span>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label
              htmlFor="refund-amount-input"
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--theme-elevation-800)' }}
            >
              Refund amount (£)
            </label>
            <input
              id="refund-amount-input"
              type="number"
              min={0}
              max={orderTotalPounds}
              step={0.01}
              placeholder={orderTotalPounds > 0 ? orderTotalPounds.toFixed(2) : '0.00'}
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
              Leave empty for full refund. Max: £{orderTotalPounds.toFixed(2)}
            </span>
          </div>
          <Button
            buttonStyle="primary"
            onClick={handleRefund}
            disabled={loading || orderTotalPence <= 0 || (partialAmountPounds !== '' && !isValidPartial)}
          >
            {loading ? 'Refunding…' : refundPence < orderTotalPence ? 'Refund partial amount' : 'Refund full amount'}
          </Button>
        </>
      )}
      {message && (
        <span style={{ color: message.type === 'error' ? 'var(--theme-error-500)' : 'var(--theme-success-500)', fontSize: 12 }}>
          {message.text}
        </span>
      )}
    </div>
  )
}
