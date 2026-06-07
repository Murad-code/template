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

function resolvePalette(theme: SiteTheme | null | undefined): PaletteMode {
  if (theme?.paletteMode === 'custom') {
    return mapCustomPaletteToMode(theme?.customPalette || {})
  }

  if (!theme?.paletteMode || theme.paletteMode === 'palette') {
    const saved = theme?.palette
    if (saved && typeof saved === 'object') {
      return mapCustomPaletteToMode(saved)
    }
  }

  return fallbackPalette
}

export function getLandingThemeCss(theme: SiteTheme | null | undefined): string {
  const palette = resolvePalette(theme)

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
}
`
}
