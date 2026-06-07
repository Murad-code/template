'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

function normalizeHex(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toUpperCase()
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const chars = trimmed.slice(1).split('')
    return `#${chars.map((char) => `${char}${char}`).join('')}`.toUpperCase()
  }
  return trimmed
}

function isHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

export const ColorPickerField: TextFieldClientComponent = ({ field, path }) => {
  const label = typeof field.label === 'string' ? field.label : field.name
  const description = typeof field.admin?.description === 'string' ? field.admin.description : undefined
  const { setValue, value } = useField<string>({ path })

  const normalized = normalizeHex(value || '')
  const swatchValue = isHex(normalized) ? normalized : '#000000'

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      {description ? (
        <div style={{ color: 'var(--theme-elevation-600)', fontSize: 12, marginBottom: 8 }}>
          {description}
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          aria-label={`${label} color picker`}
          onChange={(event) => setValue(event.target.value.toUpperCase())}
          style={{ width: 44, height: 32, borderRadius: 6, border: '1px solid var(--theme-elevation-300)' }}
          type="color"
          value={swatchValue}
        />
        <input
          aria-label={`${label} hex value`}
          onBlur={() => setValue(normalized)}
          onChange={(event) => setValue(event.target.value)}
          placeholder="#1F2937"
          style={{
            flex: 1,
            border: '1px solid var(--theme-elevation-250)',
            borderRadius: 6,
            height: 32,
            padding: '0 10px',
            fontFamily: 'var(--font-mono)',
          }}
          value={value || ''}
        />
      </div>
    </div>
  )
}
