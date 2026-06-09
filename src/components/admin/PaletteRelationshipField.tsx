'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { RelationshipFieldClientComponent } from 'payload'

type PaletteDoc = {
  id: number
  name: string
  color1?: string | null
  color2?: string | null
  color3?: string | null
  color4?: string | null
  color5?: string | null
}

function Swatches({ palette }: { palette: PaletteDoc }) {
  const colors = [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5].filter(
    (color): color is string => Boolean(color && color.trim()),
  )

  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', borderRadius: 6, border: '1px solid var(--theme-elevation-200)' }}>
      {(colors.length ? colors : ['#d1d5db']).map((color, index) => (
        <span
          key={`${palette.id}-${color}-${index}`}
          style={{
            width: 24,
            height: 20,
            backgroundColor: color,
            borderRight: index === colors.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}
        />
      ))}
    </span>
  )
}

export const PaletteRelationshipField: RelationshipFieldClientComponent = ({ field, path }) => {
  const { setValue, value } = useField<number | PaletteDoc | null>({ path })
  const [palettes, setPalettes] = useState<PaletteDoc[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const paletteMode = useFormFields(([fields]) => {
    const typed = fields as { paletteMode?: { value?: string } }
    return typed.paletteMode?.value
  })

  const triggerSave = () => {
    const form = wrapperRef.current?.closest('form')
    if (form && form instanceof HTMLFormElement) {
      form.requestSubmit()
    }
  }

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch('/api/theme-palettes?limit=100&sort=name&depth=0', {
          credentials: 'include',
        })
        if (!response.ok) return
        const json = (await response.json()) as { docs?: PaletteDoc[] }
        if (!cancelled) setPalettes(json.docs || [])
      } catch {
        if (!cancelled) setPalettes([])
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selectedID = typeof value === 'object' && value ? value.id : value

  const selected = useMemo(() => {
    if (typeof value === 'object' && value) return value
    return palettes.find((palette) => palette.id === selectedID) || null
  }, [palettes, selectedID, value])

  const filteredPalettes = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return palettes
    return palettes.filter((palette) => palette.name.toLowerCase().includes(normalized))
  }, [palettes, query])

  const isPrimaryPaletteField = path === 'palette'
  if (isPrimaryPaletteField && paletteMode && paletteMode !== 'palette') return null

  const label = typeof field.label === 'string' ? field.label : 'Palette'

  return (
    <div ref={wrapperRef} style={{ marginBottom: 12, position: 'relative' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <button
        onClick={() => {
          setIsOpen((open) => !open)
          if (!isOpen) setQuery('')
        }}
        style={{
          width: '100%',
          minHeight: 40,
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
        type="button"
      >
        {selected ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Swatches palette={selected} />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span style={{ color: 'var(--theme-elevation-500)' }}>Select palette...</span>
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
            maxHeight: 260,
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
          }}
        >
          <div style={{ padding: 8, borderBottom: '1px solid var(--theme-elevation-150)' }}>
            <input
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search palettes..."
              style={{
                width: '100%',
                height: 34,
                border: '1px solid var(--theme-elevation-250)',
                borderRadius: 6,
                padding: '0 10px',
              }}
              value={query}
            />
          </div>
          {filteredPalettes.length ? (
            filteredPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => {
                  setValue(palette.id)
                  setIsOpen(false)
                  setQuery('')
                  // Trigger save so Payload live preview refreshes immediately after palette changes.
                  setTimeout(triggerSave, 0)
                }}
                style={{
                  width: '100%',
                  border: 0,
                  borderBottom: '1px solid var(--theme-elevation-100)',
                  background: palette.id === selectedID ? 'var(--theme-elevation-100)' : 'transparent',
                  padding: '8px 10px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                type="button"
              >
                <Swatches palette={palette} />
                <span>{palette.name}</span>
              </button>
            ))
          ) : (
            <div style={{ padding: 12, color: 'var(--theme-elevation-600)', fontSize: 13 }}>No palettes found.</div>
          )}
        </div>
      ) : null}
    </div>
  )
}
