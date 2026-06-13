'use client'

import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

export const PaletteHelp: UIFieldClientComponent = () => {
  const paletteMode = useFormFields(([fields]) => {
    const typed = fields as { paletteMode?: { value?: string } }
    return typed.paletteMode?.value
  })

  if (paletteMode && paletteMode !== 'palette') return null

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
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Palette management</div>
      <div style={{ fontSize: 13, color: 'var(--theme-elevation-700)', marginBottom: 8 }}>
        Create a named palette once, then select it from the palette dropdown anytime.
      </div>
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)' }}>
        To create or manage palettes, go to the <strong>Theme Palettes</strong> page in the admin panel.
      </div>
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginTop: 6 }}>
        The preview now shows pass/fail contrast checks per role pair. In custom mode, use the helper actions
        to auto-generate dark values and auto-fix text contrast before refining.
      </div>
    </div>
  )
}
