import type { SiteTheme } from '@/payload-types'
import type { TypographyFontValue } from '@/config/typographyFonts'

import { ensureContrast, mix, pickReadable } from '@/utilities/colorMix'

type PaletteColors = {
  background: string
  body: string
  /**
   * The colour calls to action are built from: the palette's darkest tone in
   * light mode, its mid tone in dark mode. Both are the most saturated thing
   * the palette can put against its own background, which is what makes a
   * button look like it belongs to the brand rather than to the framework.
   */
  brand: string
  cardBackground: string
  cardBorder: string
  heading: string
}

type PaletteMode = {
  light: PaletteColors
  dark: PaletteColors
}

export type SiteThemePreviewInput = {
  paletteMode?: SiteTheme['paletteMode']
  palette?: unknown
  darkPalette?: unknown
  customPalette?: {
    color1?: string | null
    color2?: string | null
    color3?: string | null
    color4?: string | null
    color5?: string | null
    lightText?: string | null
    darkText?: string | null
  } | null
  typography?: {
    bodyFont?: string | null
    headingFont?: string | null
    monoFont?: string | null
  } | null
} | null

const FONT_STACKS = {
  'geist-sans': 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  'system-sans':
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'system-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  inter: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  'source-sans-3': 'var(--font-source-sans-3), ui-sans-serif, system-ui, sans-serif',
  'nunito-sans': 'var(--font-nunito-sans), ui-sans-serif, system-ui, sans-serif',
  montserrat: 'var(--font-montserrat), ui-sans-serif, system-ui, sans-serif',
  'space-grotesk': 'var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif',
  'playfair-display':
    'var(--font-playfair-display), ui-serif, Georgia, Cambria, "Times New Roman", serif',
  lora: 'var(--font-lora), ui-serif, Georgia, Cambria, "Times New Roman", serif',
  merriweather: 'var(--font-merriweather), ui-serif, Georgia, Cambria, "Times New Roman", serif',
  'dm-serif-display':
    'var(--font-dm-serif-display), ui-serif, Georgia, Cambria, "Times New Roman", serif',
  'geist-mono':
    'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  'system-mono':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  'jetbrains-mono':
    'var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  'fira-code':
    'var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  'ibm-plex-mono':
    'var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  'source-code-pro':
    'var(--font-source-code-pro), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  'roboto-mono':
    'var(--font-roboto-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
} as const

type FontToken = TypographyFontValue

const fallbackPalette: PaletteMode = {
  // Neutral defaults that preserve the original clean admin/frontend baseline.
  light: {
    background: '#FFFFFF',
    brand: '#1F2937',
    cardBackground: '#F6F7F9',
    cardBorder: '#E5E7EB',
    heading: '#111827',
    body: '#111827',
  },
  dark: {
    background: '#111827',
    brand: '#E5E7EB',
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
      brand: c4,
      cardBackground: c2,
      cardBorder: c3,
      heading: lightText,
      body: lightText,
    },
    dark: {
      background: c5,
      brand: c3,
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

function resolvePalette(theme: SiteThemePreviewInput): PaletteMode {
  let basePalette: PaletteMode | null = null

  if (theme?.paletteMode === 'custom') {
    basePalette = mapCustomPaletteToMode(theme?.customPalette || {})
  } else if (!theme?.paletteMode || theme.paletteMode === 'palette') {
    basePalette = mapSavedPalette(theme?.palette)
  }

  const resolvedBase = basePalette || fallbackPalette
  const darkOverride = mapSavedPalette(theme?.darkPalette)

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

function resolveTypography(theme: SiteThemePreviewInput) {
  const typography = theme?.typography

  return {
    body: resolveFontStack(typography?.bodyFont, 'geist-sans'),
    heading: resolveFontStack(typography?.headingFont, 'geist-sans'),
    mono: resolveFontStack(typography?.monoFont, 'geist-mono'),
  }
}

/**
 * Turn one mode of a palette into the complete semantic token set.
 *
 * Previously only the surface and text tokens came from the palette, and
 * `--primary`, `--accent`, `--muted` and `--ring` kept the achromatic
 * defaults in `theme.ts`. That is why a site could be themed deep green and
 * still have black buttons: the brand colour had nowhere to land. Everything
 * a component can reach for is derived here instead, so one palette choice
 * moves the whole interface together.
 *
 * Contrast is enforced rather than assumed. `assertPaletteContrast` already
 * holds saved palettes to AA, but the one-off custom palette lets an editor
 * put any two colours together, so each derived pair is checked and nudged.
 */
function deriveTokens(mode: PaletteColors, opposite: PaletteColors): Record<string, string> {
  const { background, body, brand, cardBackground, cardBorder } = mode

  const primary = ensureContrast(brand, background, 3)
  const primaryForeground = pickReadable(primary, [
    background,
    cardBackground,
    opposite.body,
    '#FFFFFF',
    '#000000',
  ])

  const secondary = mix(cardBorder, background, 0.28)
  const accent = cardBorder
  const muted = mix(cardBorder, background, 0.16)

  // Hairlines read as a hard edge at full strength, which is most of why the
  // current cards look boxed in. Three weights instead, all from the same hue.
  const border = mix(cardBorder, background, 0.62)
  const borderSubtle = mix(cardBorder, background, 0.38)
  const borderStrong = cardBorder

  const ring = ensureContrast(brand, background, 3)

  return {
    '--background': background,
    '--foreground': body,
    '--card': cardBackground,
    '--card-foreground': body,
    '--popover': background,
    '--popover-foreground': body,
    '--primary': primary,
    '--primary-foreground': primaryForeground,
    '--secondary': secondary,
    '--secondary-foreground': ensureContrast(body, secondary, 4.5),
    '--accent': accent,
    '--accent-foreground': ensureContrast(body, accent, 4.5),
    '--muted': muted,
    '--muted-foreground': ensureContrast(mix(body, background, 0.72), background, 4.5),
    '--border': border,
    '--border-subtle': borderSubtle,
    '--border-strong': borderStrong,
    '--input': border,
    '--ring': ring,
    '--focus-ring': ring,
    '--surface-base': background,
    '--surface-raised': cardBackground,
    '--surface-soft-panel': mix(cardBackground, background, 0.82),
    '--surface-header': background,
    '--surface-footer': cardBackground,
    '--text-primary': body,
    '--text-secondary': ensureContrast(mix(body, background, 0.72), background, 4.5),
    '--text-inverse': opposite.body,
    '--landing-background': background,
    '--landing-card-background': cardBackground,
    '--landing-card-border': cardBorder,
    '--landing-heading': mode.heading,
    '--landing-body': body,
  }
}

function tokensToCss(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')
}

export function getLandingThemeCss(theme: SiteThemePreviewInput): string {
  const palette = resolvePalette(theme)
  const typography = resolveTypography(theme)

  const fonts = [
    `  --site-font-sans: ${typography.body};`,
    `  --site-font-heading: ${typography.heading};`,
    `  --site-font-mono: ${typography.mono};`,
  ].join('\n')

  return `
:root {
${tokensToCss(deriveTokens(palette.light, palette.dark))}
${fonts}
}

[data-theme='dark'] {
${tokensToCss(deriveTokens(palette.dark, palette.light))}
${fonts}
}
`
}
