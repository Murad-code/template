'use client'

import { useDocumentInfo, useFormFields, Button } from '@payloadcms/ui'
import { useState } from 'react'

export function OrderDownloadInvoiceButton() {
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!id || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        setError(text || `Error ${res.status}`)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'refunded') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>
          Invoice available for download (order was refunded).
        </span>
        <Button
          buttonStyle="secondary"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? 'Downloading…' : 'Download invoice'}
        </Button>
        {error && (
          <span style={{ fontSize: 12, color: 'var(--theme-error-500)' }}>{error}</span>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Button
        buttonStyle="secondary"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? 'Downloading…' : 'Download invoice'}
      </Button>
      {error && (
        <span style={{ fontSize: 12, color: 'var(--theme-error-500)' }}>{error}</span>
      )}
    </div>
  )
}
