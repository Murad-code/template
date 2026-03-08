'use client'

import { useDocumentInfo, useFormFields, Button } from '@payloadcms/ui'
import { useState } from 'react'

export function OrderRefundButton() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined)
  const isRefunded = status === 'refunded'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleRefund = async () => {
    if (!id || loading) return
    if (!confirm('Refund this order? This will call Stripe and update the order status.')) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/orders/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
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
        <Button
          buttonStyle="secondary"
          label={loading ? 'Refunding…' : 'Refund order'}
          onClick={handleRefund}
          disabled={loading}
        />
      )}
      {message && (
        <span style={{ color: message.type === 'error' ? 'var(--theme-error-500)' : 'var(--theme-success-500)', fontSize: 12 }}>
          {message.text}
        </span>
      )}
    </div>
  )
}
