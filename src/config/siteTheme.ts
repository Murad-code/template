import type { SiteTheme } from '@/payload-types'

type PaletteColors = {
  background: string
  body: string
  cardBackground: string
  cardBorder: string
  heading: string
}

type PaletteMode = {
  light: PaletteColors
  dark: PaletteColors
}

const FONT_STACKS = {
  'geist-sans': 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  'system-sans':
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'system-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  'geist-mono':
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  'system-mono':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const

type FontToken = keyof typeof FONT_STACKS

const fallbackPalette: PaletteMode = {
  // Neutral defaults that preserve the original clean admin/frontend baseline.
  light: {
    background: '#FFFFFF',
    cardBackground: '#F6F7F9',
    cardBorder: '#E5E7EB',
    heading: '#111827',
    body: '#111827',
  },
  dark: {
    background: '#111827',
    cardBackground: '#1F2937',
    cardBorder: '#374151',
    heading: '#F9FAFB',
    body: '#F9FAFB',
  },
}

function withFallback(value: string | null | undefined, fallback: string): string {
  return value?.trim() || fallback
}

function mapCustomPaletteToMode(input: {
  color1?: string | null
  color2?: string | null
  color3?: string | null
  color4?: string | null
  color5?: string | null
  lightText?: string | null
  darkText?: string | null
}): PaletteMode {
  const c1 = withFallback(input.color1, '#ffffff')
  const c2 = withFallback(input.color2, '#f5f5f7')
  const c3 = withFallback(input.color3, '#9bcaf0')
  const c4 = withFallback(input.color4, '#0068ad')
  const c5 = withFallback(input.color5, '#000000')
  const lightText = withFallback(input.lightText, '#111827')
  const darkText = withFallback(input.darkText, '#f8fafc')

  return {
    light: {
      background: c1,
      cardBackground: c2,
      cardBorder: c3,
      heading: lightText,
      body: lightText,
    },
    dark: {
      background: c5,
      cardBackground: c4,
      cardBorder: c3,
      heading: darkText,
      body: darkText,
    },
  }
}

function mapSavedPalette(value: unknown): PaletteMode | null {
  if (!value || typeof value !== 'object') return null
  return mapCustomPaletteToMode(value as Parameters<typeof mapCustomPaletteToMode>[0])
}

function resolvePalette(theme: SiteTheme | null | undefined): PaletteMode {
  let basePalette: PaletteMode | null = null

  if (theme?.paletteMode === 'custom') {
    basePalette = mapCustomPaletteToMode(theme?.customPalette || {})
  } else if (!theme?.paletteMode || theme.paletteMode === 'palette') {
    basePalette = mapSavedPalette(theme?.palette)
  }

  const resolvedBase = basePalette || fallbackPalette
  const darkOverride = mapSavedPalette((theme as SiteTheme & { darkPalette?: unknown })?.darkPalette)

  if (!darkOverride) return resolvedBase

  return {
    light: resolvedBase.light,
    dark: darkOverride.dark,
  }
}

function resolveFontStack(value: unknown, fallback: FontToken): string {
  if (typeof value !== 'string') return FONT_STACKS[fallback]
  const token = value as FontToken
  return FONT_STACKS[token] || FONT_STACKS[fallback]
}

function resolveTypography(theme: SiteTheme | null | undefined) {
  const typography = theme?.typography

  return {
    body: resolveFontStack(typography?.bodyFont, 'geist-sans'),
    heading: resolveFontStack(typography?.headingFont, 'geist-sans'),
    mono: resolveFontStack(typography?.monoFont, 'geist-mono'),
  }
}

export function getLandingThemeCss(theme: SiteTheme | null | undefined): string {
  const palette = resolvePalette(theme)
  const typography = resolveTypography(theme)

  return `
:root {
  --background: ${palette.light.background};
  --foreground: ${palette.light.body};
  --card: ${palette.light.cardBackground};
  --card-foreground: ${palette.light.body};
  --border: ${palette.light.cardBorder};
  --landing-background: ${palette.light.background};
  --landing-card-background: ${palette.light.cardBackground};
  --landing-card-border: ${palette.light.cardBorder};
  --landing-heading: ${palette.light.heading};
  --landing-body: ${palette.light.body};
  --site-font-sans: ${typography.body};
  --site-font-heading: ${typography.heading};
  --site-font-mono: ${typography.mono};
}

[data-theme='dark'] {
  --background: ${palette.dark.background};
  --foreground: ${palette.dark.body};
  --card: ${palette.dark.cardBackground};
  --card-foreground: ${palette.dark.body};
  --border: ${palette.dark.cardBorder};
  --landing-background: ${palette.dark.background};
  --landing-card-background: ${palette.dark.cardBackground};
  --landing-card-border: ${palette.dark.cardBorder};
  --landing-heading: ${palette.dark.heading};
  --landing-body: ${palette.dark.body};
  --site-font-sans: ${typography.body};
  --site-font-heading: ${typography.heading};
  --site-font-mono: ${typography.mono};
}
`
}
