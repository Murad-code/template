/**
 * Theme palette and font configuration.
 * Default values match the existing globals.css; override via env for quick rebranding.
 * For full control, edit this file or extend with THEME_* env vars.
 */

export interface ThemePalette {
  background: string
  foreground: string
  card: string
  'card-foreground': string
  popover: string
  'popover-foreground': string
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  muted: string
  'muted-foreground': string
  accent: string
  'accent-foreground': string
  destructive: string
  'destructive-foreground': string
  border: string
  input: string
  ring: string
  'chart-1': string
  'chart-2': string
  'chart-3': string
  'chart-4': string
  'chart-5': string
  radius: string
  sidebar: string
  'sidebar-foreground': string
  'sidebar-primary': string
  'sidebar-primary-foreground': string
  'sidebar-accent': string
  'sidebar-accent-foreground': string
  'sidebar-border': string
  'sidebar-ring': string
  success: string
  warning: string
  error: string
}

const defaultLight: ThemePalette = {
  background: 'oklch(100% 0 0deg)',
  foreground: 'oklch(14.5% 0 0deg)',
  card: 'oklch(96.5% 0.005 265deg)',
  'card-foreground': 'oklch(14.5% 0 0deg)',
  popover: 'oklch(100% 0 0deg)',
  'popover-foreground': 'oklch(14.5% 0 0deg)',
  primary: 'oklch(20.5% 0 0deg)',
  'primary-foreground': 'oklch(98.5% 0 0deg)',
  secondary: 'oklch(97% 0 0deg)',
  'secondary-foreground': 'oklch(20.5% 0 0deg)',
  muted: 'oklch(97% 0 0deg)',
  'muted-foreground': 'oklch(55.6% 0 0deg)',
  accent: 'oklch(97% 0 0deg)',
  'accent-foreground': 'oklch(20.5% 0 0deg)',
  destructive: 'oklch(57.7% 0.245 27.325deg)',
  'destructive-foreground': 'oklch(57.7% 0.245 27.325deg)',
  border: 'oklch(92.2% 0 0deg)',
  input: 'oklch(92.2% 0 0deg)',
  ring: 'oklch(70.8% 0 0deg)',
  'chart-1': 'oklch(64.6% 0.222 41.116deg)',
  'chart-2': 'oklch(60% 0.118 184.704deg)',
  'chart-3': 'oklch(39.8% 0.07 227.392deg)',
  'chart-4': 'oklch(82.8% 0.189 84.429deg)',
  'chart-5': 'oklch(76.9% 0.188 70.08deg)',
  radius: '0.625rem',
  sidebar: 'oklch(98.5% 0 0deg)',
  'sidebar-foreground': 'oklch(14.5% 0 0deg)',
  'sidebar-primary': 'oklch(20.5% 0 0deg)',
  'sidebar-primary-foreground': 'oklch(98.5% 0 0deg)',
  'sidebar-accent': 'oklch(97% 0 0deg)',
  'sidebar-accent-foreground': 'oklch(20.5% 0 0deg)',
  'sidebar-border': 'oklch(92.2% 0 0deg)',
  'sidebar-ring': 'oklch(70.8% 0 0deg)',
  success: 'oklch(78% 0.08 200deg)',
  warning: 'oklch(89% 0.1 75deg)',
  error: 'oklch(75% 0.15 25deg)',
}

const defaultDark: ThemePalette = {
  background: 'oklch(14.5% 0 0deg)',
  foreground: 'oklch(98.5% 0 0deg)',
  card: 'oklch(17% 0 0deg)',
  'card-foreground': 'oklch(98.5% 0 0deg)',
  popover: 'oklch(14.5% 0 0deg)',
  'popover-foreground': 'oklch(98.5% 0 0deg)',
  primary: 'oklch(98.5% 0 0deg)',
  'primary-foreground': 'oklch(20.5% 0 0deg)',
  secondary: 'oklch(26.9% 0 0deg)',
  'secondary-foreground': 'oklch(98.5% 0 0deg)',
  muted: 'oklch(26.9% 0 0deg)',
  'muted-foreground': 'oklch(70.8% 0 0deg)',
  accent: 'oklch(26.9% 0 0deg)',
  'accent-foreground': 'oklch(98.5% 0 0deg)',
  destructive: 'oklch(39.6% 0.141 25.723deg)',
  'destructive-foreground': 'oklch(63.7% 0.237 25.331deg)',
  border: 'oklch(26.9% 0 0deg)',
  input: 'oklch(26.9% 0 0deg)',
  ring: 'oklch(43.9% 0 0deg)',
  'chart-1': 'oklch(48.8% 0.243 264.376deg)',
  'chart-2': 'oklch(69.6% 0.17 162.48deg)',
  'chart-3': 'oklch(76.9% 0.188 70.08deg)',
  'chart-4': 'oklch(62.7% 0.265 303.9deg)',
  'chart-5': 'oklch(64.5% 0.246 16.439deg)',
  radius: '0.625rem',
  sidebar: 'oklch(20.5% 0 0deg)',
  'sidebar-foreground': 'oklch(98.5% 0 0deg)',
  'sidebar-primary': 'oklch(48.8% 0.243 264.376deg)',
  'sidebar-primary-foreground': 'oklch(98.5% 0 0deg)',
  'sidebar-accent': 'oklch(26.9% 0 0deg)',
  'sidebar-accent-foreground': 'oklch(98.5% 0 0deg)',
  'sidebar-border': 'oklch(26.9% 0 0deg)',
  'sidebar-ring': 'oklch(43.9% 0 0deg)',
  success: 'oklch(28% 0.1 200deg)',
  warning: 'oklch(35% 0.08 70deg)',
  error: 'oklch(45% 0.1 25deg)',
}

export interface ThemeConfig {
  light: ThemePalette
  dark: ThemePalette
  /** Font preset: 'geist' (default) | add more in layout font map */
  fontSans: string
  fontMono: string
}

function paletteToCssVars(palette: ThemePalette): string {
  return Object.entries(palette)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n  ')
}

function semanticSurfaceVars(): string {
  return [
    '--surface-base: var(--background);',
    '--surface-raised: var(--card);',
    '--surface-soft-panel: color-mix(in srgb, var(--card) 82%, var(--background));',
    '--surface-header: var(--card);',
    '--surface-footer: var(--card);',
    '--text-primary: var(--foreground);',
    '--text-secondary: var(--muted-foreground);',
    '--text-inverse: var(--primary-foreground);',
    '--border-subtle: var(--border);',
    '--border-strong: color-mix(in srgb, var(--border) 70%, var(--foreground));',
    '--focus-ring: var(--ring);',
    '--elevation-soft: 0 2px 6px color-mix(in srgb, #000 10%, transparent), 0 1px 2px color-mix(in srgb, #000 8%, transparent);',
    '--elevation-soft-hover: 0 3px 8px color-mix(in srgb, #000 14%, transparent), 0 1px 2px color-mix(in srgb, #000 10%, transparent);',
    '--elevation-soft-pressed: inset 0 2px 5px color-mix(in srgb, #000 22%, transparent), 0 1px 2px color-mix(in srgb, #000 8%, transparent);',
  ].join('\n  ')
}

export function getThemeConfig(): ThemeConfig {
  return {
    light: defaultLight,
    dark: defaultDark,
    fontSans: process.env.FONT_SANS || 'geist',
    fontMono: process.env.FONT_MONO || 'geist',
  }
}

/** Generate CSS for :root and [data-theme='dark'] from theme config (for inline injection). */
export function getThemeCss(): string {
  const { light, dark } = getThemeConfig()
  return `:root {
  ${paletteToCssVars(light)}
  ${semanticSurfaceVars()}
}

[data-theme='dark'] {
  ${paletteToCssVars(dark)}
  ${semanticSurfaceVars()}
}`
}
