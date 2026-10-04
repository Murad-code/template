/**
 * Colour maths for deriving a full semantic token set from the handful of
 * brand colours an editor picks in the Site Theme global.
 *
 * Everything works in sRGB hex because that is what the palette fields store
 * and what `getContrastRatio` already understands. CSS `color-mix()` would do
 * the blending at runtime, but the *decisions* here (is this readable? does
 * this need lightening?) have to happen where the hex values are known, which
 * is on the server at render time.
 */

import { getContrastRatio } from '@/utilities/colorContrast'

export type Rgb = { r: number; g: number; b: number }

export function hexToRgb(hex: string): Rgb | null {
  const value = hex.trim()
  const full = /^#[0-9a-fA-F]{3}$/.test(value)
    ? `#${value
        .slice(1)
        .split('')
        .map((char) => `${char}${char}`)
        .join('')}`
    : value

  if (!/^#[0-9a-fA-F]{6}$/.test(full)) return null

  return {
    r: parseInt(full.slice(1, 3), 16),
    g: parseInt(full.slice(3, 5), 16),
    b: parseInt(full.slice(5, 7), 16),
  }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase()
}

/** Blend `amount` of `color` into `base`, where amount is 0–1. */
export function mix(color: string, base: string, amount: number): string {
  const a = hexToRgb(color)
  const b = hexToRgb(base)
  if (!a || !b) return color

  const t = Math.min(1, Math.max(0, amount))

  return rgbToHex({
    r: a.r * t + b.r * (1 - t),
    g: a.g * t + b.g * (1 - t),
    b: a.b * t + b.b * (1 - t),
  })
}

/**
 * Whichever of the candidates reads best on `background`. Used instead of
 * assuming black or white, so a button derived from a mid-tone brand colour
 * still takes the palette's own text colours where they work.
 */
export function pickReadable(background: string, candidates: string[]): string {
  let best = candidates[0] ?? '#000000'
  let bestRatio = -1

  for (const candidate of candidates) {
    const ratio = getContrastRatio(candidate, background) ?? 0
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = candidate
    }
  }

  return best
}

/**
 * Push `color` away from `against` until it clears `target` contrast, or until
 * further movement stops helping.
 *
 * The palette validator already guarantees the seeded combinations clear their
 * thresholds, so in practice this only fires for one-off custom palettes, where
 * an editor can put any two colours together. Degrading to a slightly-off brand
 * colour beats shipping an unreadable control.
 */
export function ensureContrast(color: string, against: string, target: number): string {
  if ((getContrastRatio(color, against) ?? 0) >= target) return color

  const againstLuminanceIsLow = (getContrastRatio('#FFFFFF', against) ?? 0) > (getContrastRatio('#000000', against) ?? 0)
  const towards = againstLuminanceIsLow ? '#FFFFFF' : '#000000'

  let candidate = color
  for (let step = 1; step <= 20; step++) {
    candidate = mix(towards, color, step / 20)
    if ((getContrastRatio(candidate, against) ?? 0) >= target) return candidate
  }

  return towards
}
