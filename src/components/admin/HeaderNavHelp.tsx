'use client'

import { toast, useFormFields } from '@payloadcms/ui'
import { useState } from 'react'
import type { UIFieldClientComponent } from 'payload'

type HeaderNavItem = {
  id?: string | null
  link?: {
    type?: 'custom' | 'reference' | null
    label: string
    url?: string | null
    newTab?: boolean | null
    reference?: {
      relationTo?: string
      value?: string | { slug?: string } | null
    } | null
  }
}

const CORE_LINKS: Array<{ label: string; url: string }> = [
  { label: 'Shop', url: '/shop' },
  { label: 'Workshops', url: '/book' },
  { label: 'Account', url: '/account' },
]

function normalizePath(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim().split('#')[0]?.split('?')[0] ?? ''
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return null
  if (trimmed === '/') return '/'
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const withoutTrailingSlash = withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash
  return withoutTrailingSlash.toLowerCase() || '/'
}

function navItemPath(item: HeaderNavItem): string | null {
  const link = item.link
  if (!link) return null
  if (link.type === 'custom') return normalizePath(link.url)
  if (link.type === 'reference' && link.reference?.value && typeof link.reference.value === 'object') {
    const slug = link.reference.value.slug
    return typeof slug === 'string' ? normalizePath(`/${slug}`) : null
  }
  return null
}

export const HeaderNavHelp: UIFieldClientComponent = () => {
  const fieldValues = useFormFields(([fields]) => fields as Record<string, { value?: unknown }>)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navItemsValue = fieldValues.navItems?.value
  const existing =
    Array.isArray(navItemsValue) && navItemsValue.length > 0
      ? (navItemsValue as HeaderNavItem[])
      : (() => {
          const rowMap = new Map<number, { label?: string; url?: string }>()
          for (const [key, field] of Object.entries(fieldValues)) {
            const urlMatch = key.match(/^navItems\.(\d+)\.link\.url$/)
            if (urlMatch && typeof field.value === 'string') {
              const index = Number(urlMatch[1])
              const row = rowMap.get(index) ?? {}
              row.url = field.value
              rowMap.set(index, row)
              continue
            }

            const labelMatch = key.match(/^navItems\.(\d+)\.link\.label$/)
            if (labelMatch && typeof field.value === 'string') {
              const index = Number(labelMatch[1])
              const row = rowMap.get(index) ?? {}
              row.label = field.value
              rowMap.set(index, row)
            }
          }

          return [...rowMap.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([, row]) => row)
            .filter((row): row is { label: string; url: string } => Boolean(row.label?.trim()) && Boolean(row.url?.trim()))
            .map((row) => ({ link: { type: 'custom' as const, label: row.label, url: row.url } }))
        })()

  const usedPaths = new Set(
    existing.map((item) => navItemPath(item)).filter((pathValue): pathValue is string => Boolean(pathValue)),
  )
  const missingCoreLinks = CORE_LINKS.filter(({ url }) => !usedPaths.has(url.toLowerCase()))

  if (missingCoreLinks.length === 0) return null

  const onGenerateLinks = () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    fetch('/api/header/seed-core-links', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ navItems: existing }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Unable to seed core header links.')
        const data = (await res.json()) as { added?: number; trimmed?: number }

        if ((data.added ?? 0) > 0) {
          toast.success(`Added and saved ${data.added} missing core header link(s).`)
        } else {
          toast.info('No missing core header links were added.')
        }
        if ((data.trimmed ?? 0) > 0) {
          toast.info(`Trimmed ${data.trimmed} extra nav link(s) to keep within the 10-link header limit.`)
        }
        setTimeout(() => window.location.reload(), 300)
      })
      .catch(() => {
        toast.error('Could not update header links. Please try again.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div
      style={{
        marginBottom: 12,
        border: '1px solid var(--theme-elevation-200)',
        borderRadius: 8,
        padding: '10px 12px',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Header link note</div>
      <div style={{ fontSize: 13, color: 'var(--theme-elevation-700)', marginBottom: 8 }}>
        Add <strong>/shop</strong>, <strong>/book</strong> and <strong>/account</strong> here to power key user
        journeys. They route visitors to products (shop), services/workshops (book), and the customer account area.
      </div>
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 10 }}>
        Use the helper to add missing core links quickly. Existing links are preserved.
      </div>
      <button
        className="interactive-focus"
        onClick={onGenerateLinks}
        style={{
          border: '1px solid var(--theme-elevation-300)',
          borderRadius: 6,
          background: 'var(--theme-elevation-0)',
          fontSize: 12,
          padding: '5px 10px',
          cursor: 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
        }}
        type="button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Generating...' : 'Auto-generate core header links'}
      </button>
    </div>
  )
}
