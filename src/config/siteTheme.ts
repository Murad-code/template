import type { SiteTheme } from '@/payload-types'
import type { TypographyFontValue } from '@/config/typographyFonts'

import { getContrastRatio } from '@/utilities/colorContrast'
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
    body: '#111827',
  },
  dark: {
    background: '#111827',
    brand: '#E5E7EB',
    cardBackground: '#1F2937',
    cardBorder: '#374151',
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
      body: lightText,
    },
    dark: {
      background: c5,
      brand: c3,
      cardBackground: c4,
      cardBorder: c3,
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
function isDarkSurface(background: string): boolean {
  return (
    (getContrastRatio(background, '#FFFFFF') ?? 1) > (getContrastRatio(background, '#000000') ?? 1)
  )
}

function deriveTokens(mode: PaletteColors, opposite: PaletteColors): Record<string, string> {
  const { background, body, brand, cardBackground, cardBorder } = mode
  const dark = isDarkSurface(background)

  const primary = ensureContrast(brand, background, 3)
  const primaryForeground = pickReadable(primary, [
    background,
    cardBackground,
    opposite.body,
    '#FFFFFF',
    '#000000',
  ])

  /**
   * Surfaces carry the hierarchy, not strokes.
   *
   * Elevation moves towards the text colour in dark mode and towards the page
   * in light mode, which is the direction each one reads as "closer". A panel
   * is therefore a tonal step rather than a rectangle with an outline, and a
   * dialog lifts off the page without needing an edge drawn round it.
   *
   * The light-mode card is nudged a little further from the page than the
   * palette's own `color2`, because two near-whites a couple of percent apart
   * only separate if something draws a line between them — which is exactly
   * what we are removing.
   */
  const card = dark ? cardBackground : mix(cardBorder, cardBackground, 0.14)
  const surfaceRaised = dark ? mix(body, cardBackground, 0.05) : background
  const popover = dark ? mix(body, cardBackground, 0.08) : background

  const secondary = dark ? mix(body, cardBackground, 0.1) : mix(cardBorder, background, 0.26)
  const accent = cardBorder
  const muted = dark ? mix(body, background, 0.08) : mix(cardBorder, background, 0.16)

  /**
   * Hairlines are a low-percentage wash of the text colour over the surface,
   * only faintly hued by the brand.
   *
   * Deriving them from `color3` instead, as this used to, meant a palette
   * whose mid-tone is light — which is most of them — drew pale grey outlines
   * on a near-black page. A border should sit far below text and well below
   * an interactive state in contrast; `strong` and `input` are the two that
   * are allowed to be seen, because a form control and a selected item have
   * to show their own shape.
   */
  const hairline = mix(cardBorder, body, 0.3)
  const border = mix(hairline, card, dark ? 0.1 : 0.13)
  const borderSubtle = mix(hairline, card, dark ? 0.06 : 0.08)
  const borderStrong = mix(hairline, card, dark ? 0.26 : 0.3)
  const input = mix(hairline, background, dark ? 0.2 : 0.24)

  const ring = ensureContrast(brand, background, 3)

  /**
   * The contrast band, and the one place light and dark part company.
   *
   * `--primary` used to paint this, which is why a statistics band that was
   * deliberately dark on a white page came back as a near-white slab on a
   * near-black one: the brand colour is the palette's deep tone in light mode
   * and its light mid tone in dark mode, so any band painted with it changed
   * sides along with the theme.
   *
   * A band is a surface; a button is a call to action. Light mode keeps the
   * deep brand tone, because departing from a white page is what gives the
   * page its rhythm.
   *
   * Dark mode has nowhere darker to go, so it takes the palette's accent and
   * brings it down to a surface weight instead. Deriving it from the panel
   * tone made a band that was merely a lighter grey, which read as an absence
   * of colour rather than a decision; starting from the accent means the band
   * carries the brand's own hue — amber on graphite, copper on near-black —
   * so it contrasts the way the light-mode band does, through the brand,
   * rather than through brightness.
   */
  const surfaceContrast = dark ? mix(accent, background, 0.4) : brand
  const surfaceContrastForeground = pickReadable(surfaceContrast, [
    dark ? body : opposite.body,
    body,
    '#FFFFFF',
    '#000000',
  ])

  /**
   * A call to action sitting on that band.
   *
   * In light mode the band *is* the brand colour, so the button has to step
   * away from it and borrows the band's text colour. In dark mode the band is
   * a darkened accent and the brand's mid tone still reads on it, so the
   * button stays on brand. This is also what caps how far the band can be
   * brought up: past roughly 0.4 the accent and its own darkened form stop
   * clearing 3:1 and the button falls back to plain light-on-dark.
   */
  const contrastPrimary =
    (getContrastRatio(primary, surfaceContrast) ?? 1) >= 3 ? primary : surfaceContrastForeground
  const contrastPrimaryForeground = pickReadable(contrastPrimary, [
    surfaceContrast,
    background,
    '#FFFFFF',
    '#000000',
  ])

  /**
   * Surfaces that sit over a photograph, and the only tokens here that are
   * identical in both themes.
   *
   * A scrim's job is to darken a picture so the copy on it stays legible, and
   * a picture does not get lighter because the page around it did. Theming
   * this alongside everything else is what turned the hero into a pale wash
   * in dark mode; the fix is not a better dark value but no dark value at all.
   *
   * `lightSide` is whichever half of the palette is the light one, so both
   * calls to `deriveTokens` land on the same pair of colours.
   */
  const lightSide = dark ? opposite : mode
  const darkSide = dark ? mode : opposite
  const mediaSurface = lightSide.brand
  const mediaForeground = pickReadable(mediaSurface, [darkSide.body, '#FFFFFF', '#000000'])

  return {
    '--background': background,
    '--foreground': body,
    '--card': card,
    '--card-foreground': body,
    '--popover': popover,
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
    '--input': input,
    '--ring': ring,
    '--focus-ring': ring,
    '--surface-base': background,
    '--surface-raised': surfaceRaised,
    '--surface-soft-panel': dark ? mix(body, background, 0.04) : mix(cardBorder, background, 0.1),
    /* Dialogs and sheets dim the page behind them. Taking the palette's own
       darkest tone rather than pure black keeps the wash faintly hued and
       stops a near-black page being covered in a flat, deader black. */
    '--scrim': dark ? background : opposite.background,
    '--media-surface': mediaSurface,
    '--media-foreground': mediaForeground,
    /* The band is already the deep tone, so a button on it steps to the
       copy colour. Fixed across themes like the rest of the media pair. */
    '--media-primary': mediaForeground,
    '--media-primary-foreground': mediaSurface,
    '--surface-contrast': surfaceContrast,
    '--surface-contrast-foreground': surfaceContrastForeground,
    '--surface-contrast-primary': contrastPrimary,
    '--surface-contrast-primary-foreground': contrastPrimaryForeground,
    '--surface-header': background,
    '--surface-footer': dark ? mix(body, background, 0.04) : mix(cardBorder, background, 0.1),
    '--text-primary': body,
    '--text-secondary': ensureContrast(mix(body, background, 0.72), background, 4.5),
    '--text-inverse': opposite.body,
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
