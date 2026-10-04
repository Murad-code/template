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
      expect(getContrastRatio(mode['--primary-foreground'], mode['--primary'])!).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps secondary text at AA against its own background', () => {
    for (const mode of [light, dark]) {
      expect(getContrastRatio(mode['--muted-foreground'], mode['--background'])!).toBeGreaterThanOrEqual(4.5)
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

  it('still produces a usable set when a custom palette is left empty', () => {
    const fallback = tokensFor(getLandingThemeCss({ paletteMode: 'custom', customPalette: {} }), ':root')
    expect(fallback['--primary']).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(getContrastRatio(fallback['--primary-foreground'], fallback['--primary'])!).toBeGreaterThanOrEqual(4.5)
  })
})
