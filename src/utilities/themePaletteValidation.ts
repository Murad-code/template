import { getContrastRatio } from '@/utilities/colorContrast'

const PALETTE_COLOR_KEYS = ['color1', 'color2', 'color3', 'color4', 'color5', 'lightText', 'darkText'] as const

type PaletteColorKey = (typeof PALETTE_COLOR_KEYS)[number]

export type PaletteInput = Partial<Record<PaletteColorKey, string | null | undefined>>

export type NormalizedPalette = Record<PaletteColorKey, string>

export function normalizeHexColor(input?: string | null): string | null {
  const value = input?.trim() || ''
  if (!value) return null
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toUpperCase()
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const chars = value.slice(1).split('')
    return `#${chars.map((char) => `${char}${char}`).join('')}`.toUpperCase()
  }
  return null
}

export function normalizePaletteInput(input?: PaletteInput | null): {
  normalized: Partial<NormalizedPalette>
  errors: string[]
} {
  const normalized: Partial<NormalizedPalette> = {}
  const errors: string[] = []

  for (const key of PALETTE_COLOR_KEYS) {
    const raw = input?.[key]
    const normalizedHex = normalizeHexColor(raw)
    if (raw == null || String(raw).trim() === '') continue
    if (!normalizedHex) {
      errors.push(`${key} must be a valid hex color in #RRGGBB format.`)
      continue
    }
    normalized[key] = normalizedHex
  }

  return { normalized, errors }
}

export function assertPaletteComplete(input: Partial<NormalizedPalette>, contextLabel: string): NormalizedPalette {
  const missing = PALETTE_COLOR_KEYS.filter((key) => !input[key])
  if (missing.length) {
    throw new Error(`${contextLabel} is missing required colors: ${missing.join(', ')}`)
  }
  return input as NormalizedPalette
}

export function assertPaletteContrast(palette: NormalizedPalette, contextLabel: string) {
  const checks = [
    { name: 'Light text on light background', foreground: palette.lightText, background: palette.color1, min: 4.5 },
    { name: 'Light text on light card', foreground: palette.lightText, background: palette.color2, min: 4.5 },
    { name: 'Dark text on dark background', foreground: palette.darkText, background: palette.color5, min: 4.5 },
    { name: 'Dark text on dark card', foreground: palette.darkText, background: palette.color4, min: 4.5 },
    { name: 'Text on border/accent', foreground: palette.lightText, background: palette.color3, min: 3 },
  ]

  const failures: string[] = []
  for (const check of checks) {
    const ratio = getContrastRatio(check.foreground, check.background)
    if (ratio == null || ratio < check.min) {
      failures.push(`${check.name} must be >= ${check.min}:1 (got ${ratio?.toFixed(2) ?? 'N/A'}:1).`)
    }
  }

  if (failures.length) {
    throw new Error(`${contextLabel} failed accessibility checks: ${failures.join(' ')}`)
  }
}

export function normalizeAndValidatePalette(
  input: PaletteInput | null | undefined,
  contextLabel: string,
): NormalizedPalette {
  const { normalized, errors } = normalizePaletteInput(input)
  if (errors.length) {
    throw new Error(`${contextLabel} has invalid color values: ${errors.join(' ')}`)
  }
  const complete = assertPaletteComplete(normalized, contextLabel)
  assertPaletteContrast(complete, contextLabel)
  return complete
}
