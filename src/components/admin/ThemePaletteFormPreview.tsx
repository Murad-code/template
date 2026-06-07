'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import { getContrastBadge, getContrastRatio } from '@/utilities/colorContrast'

const colorMeta = [
  { field: 'color1', label: 'Background color' },
  { field: 'color2', label: 'Primary surface' },
  { field: 'color3', label: 'Accent / border' },
  { field: 'color4', label: 'Primary color (dark)' },
  { field: 'color5', label: 'Secondary background (dark)' },
] as const

const normalizeHex = (value?: string | null) => (value?.trim() ? value.trim().toUpperCase() : '—')

export const ThemePaletteFormPreview: UIFieldClientComponent = () => {
  const values = useFormFields(([fields]) => {
    const typed = fields as Record<string, { value?: string | null }>
    return {
      color1: typed.color1?.value ?? '',
      color2: typed.color2?.value ?? '',
      color3: typed.color3?.value ?? '',
      color4: typed.color4?.value ?? '',
      color5: typed.color5?.value ?? '',
      lightText: typed.lightText?.value ?? '',
      darkText: typed.darkText?.value ?? '',
    }
  }) as Record<'color1' | 'color2' | 'color3' | 'color4' | 'color5' | 'lightText' | 'darkText', string>

  const colors = colorMeta
    .map((item) => ({
      color: (values[item.field] || '').trim(),
      label: item.label,
      hex: normalizeHex(values[item.field]),
    }))
    .filter((item) => Boolean(item.color))

  if (!colors.length) return null

  const lightTextContrast = getContrastBadge(getContrastRatio(values.lightText, values.color1))
  const darkTextContrast = getContrastBadge(getContrastRatio(values.darkText, values.color5))
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
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Palette preview</div>
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
        <span style={badgeStyle(lightTextContrast.tone)}>Light text on Color 1: {lightTextContrast.label}</span>
        <span style={badgeStyle(darkTextContrast.tone)}>Dark text on Color 5: {darkTextContrast.label}</span>
      </div>
    </div>
  )
}
