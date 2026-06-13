'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import { getContrastBadge, getContrastRatio } from '@/utilities/colorContrast'

type ThemePaletteLike = {
  id?: number
  name?: string | null
  color1?: string | null
  color2?: string | null
  color3?: string | null
  color4?: string | null
  color5?: string | null
  lightText?: string | null
  darkText?: string | null
}

const colorMeta = [
  { key: 'color1', label: 'Background color' },
  { key: 'color2', label: 'Primary surface' },
  { key: 'color3', label: 'Accent / border' },
  { key: 'color4', label: 'Primary color (dark)' },
  { key: 'color5', label: 'Secondary background (dark)' },
] as const

const normalizeHex = (value?: string | null) => (value?.trim() ? value.trim().toUpperCase() : '—')

export const PaletteSelectionPreview: UIFieldClientComponent = () => {
  const paletteValue = useFormFields(([fields]) => {
    const typed = fields as { palette?: { value?: number | ThemePaletteLike | null } }
    return typed.palette?.value
  })

  const paletteMode = useFormFields(([fields]) => {
    const typed = fields as { paletteMode?: { value?: string } }
    return typed.paletteMode?.value
  })

  const [loadedPalette, setLoadedPalette] = useState<ThemePaletteLike | null>(null)

  const paletteID = typeof paletteValue === 'number' ? paletteValue : paletteValue?.id

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!paletteID) {
        setLoadedPalette(null)
        return
      }

      if (typeof paletteValue === 'object' && paletteValue) {
        setLoadedPalette(paletteValue)
        return
      }

      try {
        const response = await fetch(`/api/theme-palettes/${paletteID}?depth=0`, {
          credentials: 'include',
        })
        if (!response.ok) return
        const json = (await response.json()) as ThemePaletteLike
        if (!cancelled) setLoadedPalette(json)
      } catch {
        if (!cancelled) setLoadedPalette(null)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [paletteID, paletteValue])

  const palette = useMemo(() => {
    if (typeof paletteValue === 'object' && paletteValue) return paletteValue
    return loadedPalette
  }, [loadedPalette, paletteValue])

  if (paletteMode && paletteMode !== 'palette') return null

  const colors = colorMeta
    .map((item) => ({
      color: palette?.[item.key] || '',
      label: item.label,
      hex: normalizeHex(palette?.[item.key]),
    }))
    .filter((item) => Boolean(item.color.trim()))

  if (!paletteID || !colors.length) return null

  const checks = [
    {
      label: 'Light text on Color 1 (background)',
      ratio: getContrastRatio(palette?.lightText, palette?.color1),
    },
    { label: 'Light text on Color 2 (card)', ratio: getContrastRatio(palette?.lightText, palette?.color2) },
    {
      label: 'Dark text on Color 5 (background)',
      ratio: getContrastRatio(palette?.darkText, palette?.color5),
    },
    { label: 'Dark text on Color 4 (card)', ratio: getContrastRatio(palette?.darkText, palette?.color4) },
  ]
  const badgeStyle = (tone: 'good' | 'warn' | 'bad') => ({
    display: 'inline-block',
    borderRadius: 999,
    padding: '3px 8px',
    fontSize: 11,
    fontWeight: 600,
    marginRight: 8,
    color:
      tone === 'good'
        ? '#14532d'
        : tone === 'warn'
          ? '#78350f'
          : '#7f1d1d',
    background:
      tone === 'good'
        ? '#dcfce7'
        : tone === 'warn'
          ? '#fef3c7'
          : '#fee2e2',
  })

  return (
    <div style={{ marginTop: -4, marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 6 }}>
        Palette preview {palette?.name ? `- ${palette.name}` : ''}
      </div>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', width: '100%' }}>
        {colors.map((item, index) => (
          <div key={`${item.hex}-${index}`} style={{ minWidth: 0 }}>
            <div
              style={{
                width: '100%',
                height: 58,
                borderRadius: 8,
                border: '1px solid var(--theme-elevation-250)',
                backgroundColor: item.color,
              }}
              title={item.hex}
            />
            <div style={{ marginTop: 6, fontSize: 12, fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
              {item.hex}
            </div>
            <div style={{ marginTop: 2, fontSize: 11, color: 'var(--theme-elevation-600)', lineHeight: 1.2 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        {checks.map((check) => {
          const badge = getContrastBadge(check.ratio)
          return (
            <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={badgeStyle(badge.tone)}>{badge.label}</span>
              <span style={{ fontSize: 12, color: 'var(--theme-elevation-700)' }}>{check.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
