'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

/**
 * Displays the refund amount in pounds. The value is stored in pence (cents) for Stripe.
 */
export const RefundAmountField: UIFieldClientComponent = (props) => {
  const value = useFormFields(([fields]) => (fields as { refundAmount?: { value?: number | null } }).refundAmount?.value ?? null) as
    | number
    | null
    | undefined

  const label = (props as { label?: string }).label ?? 'Refund amount'
  const description = (props as { description?: string }).description

  if (value == null || value === 0) {
    return (
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', marginBottom: 4 }}>
            {description}
          </div>
        )}
        <span style={{ color: 'var(--theme-elevation-600)' }}>—</span>
      </div>
    )
  }

  const pounds = (value / 100).toFixed(2)
  const display = `£ ${pounds}`

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {description && (
        <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', marginBottom: 4 }}>
          {description}
        </div>
      )}
      <div style={{ fontSize: 14 }}>{display}</div>
    </div>
  )
}
