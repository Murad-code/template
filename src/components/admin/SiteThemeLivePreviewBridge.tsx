'use client'

import { useFormFields } from '@payloadcms/ui'
import { useEffect, useMemo, useRef, useState } from 'react'

type FontField = { value?: string | null }
type Primitive = string | number | null | undefined

type PaletteDoc = {
  id: number
  color1?: string | null
  color2?: string | null
  color3?: string | null
  color4?: string | null
  color5?: string | null
  lightText?: string | null
  darkText?: string | null
}

type FormShape = Record<string, { value?: Primitive | PaletteDoc }>

function toStringValue(value: Primitive): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function toPaletteLike(value: Primitive | PaletteDoc): PaletteDoc | null {
  if (value && typeof value === 'object' && 'id' in value) return value as PaletteDoc
  return null
}

function normalizePaletteInput(input: PaletteDoc | null | undefined) {
  if (!input) return null
  return {
    color1: toStringValue(input.color1),
    color2: toStringValue(input.color2),
    color3: toStringValue(input.color3),
    color4: toStringValue(input.color4),
    color5: toStringValue(input.color5),
    lightText: toStringValue(input.lightText),
    darkText: toStringValue(input.darkText),
  }
}

export function SiteThemeLivePreviewBridge() {
  const values = useFormFields(([fields]) => {
    const typed = fields as FormShape

    return {
      paletteMode: toStringValue(typed.paletteMode?.value as Primitive) || 'palette',
      palette: typed.palette?.value,
      darkPalette: typed.darkPalette?.value,
      customPalette: {
        color1: toStringValue(typed['customPalette.color1']?.value as Primitive),
        color2: toStringValue(typed['customPalette.color2']?.value as Primitive),
        color3: toStringValue(typed['customPalette.color3']?.value as Primitive),
        color4: toStringValue(typed['customPalette.color4']?.value as Primitive),
        color5: toStringValue(typed['customPalette.color5']?.value as Primitive),
        lightText: toStringValue(typed['customPalette.lightText']?.value as Primitive),
        darkText: toStringValue(typed['customPalette.darkText']?.value as Primitive),
      },
      typography: {
        bodyFont: toStringValue(typed['typography.bodyFont']?.value as Primitive),
        headingFont: toStringValue(typed['typography.headingFont']?.value as Primitive),
        monoFont: toStringValue(typed['typography.monoFont']?.value as Primitive),
      },
    }
  })

  const [palettes, setPalettes] = useState<PaletteDoc[]>([])
  const lastSignatureRef = useRef<string | null>(null)
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const previewThemePayload = useMemo(() => {
    const paletteID = typeof values.palette === 'number' ? values.palette : null
    const darkPaletteID = typeof values.darkPalette === 'number' ? values.darkPalette : null

    const selectedPalette =
      toPaletteLike(values.palette) || palettes.find((palette) => palette.id === paletteID) || null
    const selectedDarkPalette =
      toPaletteLike(values.darkPalette) || palettes.find((palette) => palette.id === darkPaletteID) || null

    return {
      paletteMode: values.paletteMode,
      palette: normalizePaletteInput(selectedPalette),
      darkPalette: normalizePaletteInput(selectedDarkPalette),
      customPalette: values.customPalette,
      typography: values.typography,
    }
  }, [palettes, values])

  const signature = useMemo(() => JSON.stringify(previewThemePayload), [previewThemePayload])

  useEffect(() => {
    if (lastSignatureRef.current === signature) return
    lastSignatureRef.current = signature

    if (sendTimerRef.current) clearTimeout(sendTimerRef.current)
    sendTimerRef.current = setTimeout(() => {
      const iframes = Array.from(document.querySelectorAll('iframe'))
      if (!iframes.length) return

      for (const iframe of iframes) {
        const targetWindow = iframe.contentWindow
        if (!targetWindow) continue
        targetWindow.postMessage(
          {
            type: 'site-theme-live-preview',
            payload: previewThemePayload,
          },
          '*',
        )
      }
    }, 120)

    return () => {
      if (sendTimerRef.current) clearTimeout(sendTimerRef.current)
    }
  }, [previewThemePayload, signature])

  return null
}
