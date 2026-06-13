'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

import { getBestReadableText } from '@/utilities/colorContrast'
import { normalizeHexColor } from '@/utilities/themePaletteValidation'

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function darken(hex: string, amount: number): string {
  const normalized = normalizeHexColor(hex)
  if (!normalized) return hex
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  return `#${[clamp(r * (1 - amount)), clamp(g * (1 - amount)), clamp(b * (1 - amount))]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase()
}

export const PaletteAutomationTools: UIFieldClientComponent = () => {
  const values = useFormFields(([fields]) => {
    const typed = fields as Record<string, { value?: string | null }>
    return {
      paletteMode: typed.paletteMode?.value ?? 'palette',
      color1: typed['customPalette.color1']?.value ?? '',
      color2: typed['customPalette.color2']?.value ?? '',
      color3: typed['customPalette.color3']?.value ?? '',
      color4: typed['customPalette.color4']?.value ?? '',
      color5: typed['customPalette.color5']?.value ?? '',
      lightText: typed['customPalette.lightText']?.value ?? '',
      darkText: typed['customPalette.darkText']?.value ?? '',
    }
  })

  const { setValue: setColor4 } = useField<string>({ path: 'customPalette.color4' })
  const { setValue: setColor5 } = useField<string>({ path: 'customPalette.color5' })
  const { setValue: setLightText } = useField<string>({ path: 'customPalette.lightText' })
  const { setValue: setDarkText } = useField<string>({ path: 'customPalette.darkText' })

  if (values.paletteMode !== 'custom') return null

  const onAutoFixText = () => {
    const color1 = normalizeHexColor(values.color1)
    const color5 = normalizeHexColor(values.color5)
    if (color1) setLightText(getBestReadableText(color1))
    if (color5) setDarkText(getBestReadableText(color5))
  }

  const onGenerateDark = () => {
    const color1 = normalizeHexColor(values.color1)
    const color2 = normalizeHexColor(values.color2)
    const generatedColor5 = color1 ? darken(color1, 0.88) : normalizeHexColor(values.color5) || '#111827'
    const generatedColor4 = color2 ? darken(color2, 0.72) : normalizeHexColor(values.color4) || '#1F2937'

    setColor5(generatedColor5)
    setColor4(generatedColor4)
    setDarkText(getBestReadableText(generatedColor5))
  }

  return (
    <div
      style={{
        border: '1px solid var(--theme-elevation-200)',
        borderRadius: 8,
        background: 'var(--theme-elevation-50)',
        padding: '10px 12px',
        marginBottom: 12,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Palette helpers</div>
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-700)', marginBottom: 10 }}>
        Use helpers to make accessible defaults quickly, then fine-tune manually.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="interactive-focus"
          onClick={onGenerateDark}
          style={{
            border: '1px solid var(--theme-elevation-300)',
            borderRadius: 6,
            background: 'var(--theme-elevation-0)',
            fontSize: 12,
            padding: '5px 10px',
          }}
          type="button"
        >
          Generate dark palette from light
        </button>
        <button
          className="interactive-focus"
          onClick={onAutoFixText}
          style={{
            border: '1px solid var(--theme-elevation-300)',
            borderRadius: 6,
            background: 'var(--theme-elevation-0)',
            fontSize: 12,
            padding: '5px 10px',
          }}
          type="button"
        >
          Auto-fix text for contrast
        </button>
      </div>
    </div>
  )
}
