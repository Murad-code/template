'use client'

import { useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  TYPOGRAPHY_FONT_DEFINITIONS,
  type TypographyFontDefinition,
  type TypographyRole,
} from '@/config/typographyFonts'

const roleLabel: Record<TypographyRole, string> = {
  body: 'body',
  heading: 'heading',
  mono: 'mono',
}

function resolveRole(path: string): TypographyRole | null {
  if (path.endsWith('bodyFont')) return 'body'
  if (path.endsWith('headingFont')) return 'heading'
  if (path.endsWith('monoFont')) return 'mono'
  return null
}

function roleRank(font: TypographyFontDefinition, role: TypographyRole | null): number {
  if (!role) return 0

  const roles = font.typicalRoles
  const hasBody = roles.includes('body')
  const hasHeading = roles.includes('heading')
  const hasMono = roles.includes('mono')

  if (role === 'heading') {
    if (hasHeading && !hasBody && !hasMono) return 0
    if (hasHeading && hasBody && !hasMono) return 1
    if (hasBody && !hasHeading && !hasMono) return 2
    if (hasMono) return 3
    return 4
  }

  if (role === 'body') {
    if (hasBody && !hasHeading && !hasMono) return 0
    if (hasBody && hasHeading && !hasMono) return 1
    if (hasHeading && !hasBody && !hasMono) return 2
    if (hasMono) return 3
    return 4
  }

  if (hasMono && !hasBody && !hasHeading) return 0
  if (hasBody && hasHeading && !hasMono) return 1
  if (hasBody && !hasHeading && !hasMono) return 2
  if (hasHeading && !hasBody && !hasMono) return 3
  return 4
}

export const TypographyFontSelectField: SelectFieldClientComponent = ({ field, path }) => {
  const { setValue, value } = useField<string>({ path })
  const selectedValue = typeof value === 'string' ? value : ''
  const selected = TYPOGRAPHY_FONT_DEFINITIONS.find((font) => font.value === selectedValue) || null
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const role = resolveRole(path)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filteredFonts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const matching = TYPOGRAPHY_FONT_DEFINITIONS.filter((font) => {
      if (!normalized) return true
      return (
        font.label.toLowerCase().includes(normalized) ||
        font.value.toLowerCase().includes(normalized) ||
        font.family.toLowerCase().includes(normalized) ||
        font.typicalRoles.some((item) => item.includes(normalized))
      )
    })

    return matching.sort((a, b) => {
      const roleSort = roleRank(a, role) - roleRank(b, role)
      if (roleSort !== 0) return roleSort
      return a.label.localeCompare(b.label)
    })
  }, [query, role])

  const label = typeof field.label === 'string' ? field.label : 'Font'

  return (
    <div ref={wrapperRef} style={{ marginBottom: 12, position: 'relative' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open)
          if (!isOpen) setQuery('')
        }}
        style={{
          width: '100%',
          minHeight: 40,
          cursor: 'pointer',
          border: '1px solid var(--theme-elevation-250)',
          borderRadius: 6,
          background: 'var(--theme-input-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '8px 10px',
          textAlign: 'left',
        }}
      >
        {selected ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>{selected.label}</span>
            <span style={{ color: 'var(--theme-elevation-600)', fontSize: 11 }}>
              | {selected.typicalRoles.map((item) => roleLabel[item]).join('/')}
            </span>
          </span>
        ) : (
          <span style={{ color: 'var(--theme-elevation-600)' }}>Select font...</span>
        )}
        <span style={{ color: 'var(--theme-elevation-600)' }}>▾</span>
      </button>

      {isOpen ? (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            border: '1px solid var(--theme-elevation-250)',
            background: 'var(--theme-bg)',
            borderRadius: 6,
            maxHeight: 320,
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
          }}
        >
          <div style={{ padding: 8, borderBottom: '1px solid var(--theme-elevation-150)' }}>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search fonts${role ? ` (best for ${roleLabel[role].toLowerCase()})` : ''}...`}
              style={{
                width: '100%',
                height: 34,
                border: '1px solid var(--theme-elevation-250)',
                borderRadius: 6,
                padding: '0 10px',
              }}
            />
          </div>

          {filteredFonts.length ? (
            filteredFonts.map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => {
                  setValue(font.value)
                  setIsOpen(false)
                  setQuery('')
                }}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  border: 0,
                  borderBottom: '1px solid var(--theme-elevation-100)',
                  background: font.value === selectedValue ? 'var(--theme-elevation-100)' : 'transparent',
                  padding: '9px 10px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <span>{font.label}</span>
                <span style={{ color: 'var(--theme-elevation-600)', fontSize: 11 }}>
                  {font.typicalRoles.map((item) => roleLabel[item]).join('/')}
                </span>
              </button>
            ))
          ) : (
            <div style={{ padding: 12, color: 'var(--theme-elevation-600)', fontSize: 13 }}>
              No fonts found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
