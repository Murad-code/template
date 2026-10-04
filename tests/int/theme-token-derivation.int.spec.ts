import { describe, expect, it } from 'vitest'

import { getLandingThemeCss } from '@/config/siteTheme'
import { getContrastRatio } from '@/utilities/colorContrast'

const charcoalCopper = {
  color1: '#FBF9F7',
  color2: '#F1ECE6',
  color3: '#C7A17D',
  color4: '#32251D',
  color5: '#19110D',
  lightText: '#251B15',
  darkText: '#FAEEE3',
}

function tokensFor(css: string, selector: ':root' | "[data-theme='dark']"): Record<string, string> {
  const block = css.split(selector)[1]?.split('}')[0] ?? ''
  return Object.fromEntries(
    block
      .split('\n')
      .map((line) => line.trim().replace(/;$/, ''))
      .filter((line) => line.startsWith('--'))
      .map((line) => {
        const [name, ...rest] = line.split(':')
        return [name.trim(), rest.join(':').trim()]
      }),
  )
}

describe('theme token derivation', () => {
  const css = getLandingThemeCss({ paletteMode: 'custom', customPalette: charcoalCopper })
  const light = tokensFor(css, ':root')
  const dark = tokensFor(css, "[data-theme='dark']")

  it('derives the call-to-action colour from the palette rather than a fixed grey', () => {
    expect(light['--primary']).toBe('#32251D')
    expect(dark['--primary']).toBe('#C7A17D')
  })

  it('keeps button labels readable on the derived primary', () => {
    for (const mode of [light, dark]) {
      expect(
        getContrastRatio(mode['--primary-foreground'], mode['--primary'])!,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps secondary text at AA against its own background', () => {
    for (const mode of [light, dark]) {
      expect(
        getContrastRatio(mode['--muted-foreground'], mode['--background'])!,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('gives the focus ring enough contrast to be seen', () => {
    for (const mode of [light, dark]) {
      expect(getContrastRatio(mode['--ring'], mode['--background'])!).toBeGreaterThanOrEqual(3)
    }
  })

  // Regression: dark mode used the raw light border colour, so panels were
  // outlined in near-white on a near-black page.
  it('tones the dark-mode border towards the surface it sits on', () => {
    expect(dark['--border']).not.toBe(charcoalCopper.color3)
    expect(getContrastRatio(dark['--border'], dark['--card'])!).toBeLessThan(4.5)
  })

  // The design system leads with tonal surfaces, not outlines. A default
  // hairline that competes with text is what made the old UI look like a
  // wireframe, and it was worst in dark mode, where a light brand mid-tone
  // drew pale grey rectangles on a near-black page.
  it('keeps default borders far below text contrast', () => {
    for (const [name, mode] of [
      ['light', light],
      ['dark', dark],
    ] as const) {
      const onCard = getContrastRatio(mode['--border'], mode['--card'])!
      const textOnCard = getContrastRatio(mode['--foreground'], mode['--card'])!

      expect(onCard, `${name} border is an outline`).toBeLessThan(1.6)
      expect(onCard, `${name} border is invisible`).toBeGreaterThan(1.02)
      expect(textOnCard / onCard, `${name} border competes with text`).toBeGreaterThan(8)
    }
  })

  it('reserves visible edges for controls and selected states', () => {
    for (const mode of [light, dark]) {
      const border = getContrastRatio(mode['--border'], mode['--card'])!
      expect(getContrastRatio(mode['--input'], mode['--background'])!).toBeGreaterThan(border)
      expect(getContrastRatio(mode['--border-strong'], mode['--card'])!).toBeGreaterThan(border)
      expect(getContrastRatio(mode['--border-subtle'], mode['--card'])!).toBeLessThan(border)
    }
  })

  // With no stroke to define them, panels have to separate from the page by
  // tone alone.
  it('separates a card from the page without a border', () => {
    for (const [name, mode] of [
      ['light', light],
      ['dark', dark],
    ] as const) {
      const step = getContrastRatio(mode['--card'], mode['--background'])!
      expect(step, `${name} card is flush with the page`).toBeGreaterThan(1.045)
    }
  })

  // A light page is usually pure white, so an overlay cannot be lighter than
  // it and leans on `shadow-overlay` instead. On a dark page there is no such
  // fallback: the surface itself has to lift.
  it('lifts a dark-mode overlay above the panel beneath it', () => {
    expect(getContrastRatio(dark['--popover'], dark['--background'])!).toBeGreaterThan(1.08)
    expect(getContrastRatio(dark['--popover'], dark['--card'])!).toBeGreaterThan(1.02)
  })

  it('still produces a usable set when a custom palette is left empty', () => {
    const fallback = tokensFor(
      getLandingThemeCss({ paletteMode: 'custom', customPalette: {} }),
      ':root',
    )
    expect(fallback['--primary']).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(
      getContrastRatio(fallback['--primary-foreground'], fallback['--primary'])!,
    ).toBeGreaterThanOrEqual(4.5)
  })
})
