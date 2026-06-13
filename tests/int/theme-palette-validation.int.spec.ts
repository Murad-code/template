import { describe, expect, it } from 'vitest'

import {
  normalizeAndValidatePalette,
  normalizeHexColor,
} from '@/utilities/themePaletteValidation'

describe('themePaletteValidation', () => {
  it('normalizes valid hex values', () => {
    expect(normalizeHexColor('#abc')).toBe('#AABBCC')
    expect(normalizeHexColor('#1f2937')).toBe('#1F2937')
  })

  it('rejects invalid hex values', () => {
    expect(normalizeHexColor('blue')).toBeNull()
    expect(normalizeHexColor('#abcd')).toBeNull()
  })

  it('validates accessible complete palettes', () => {
    const palette = normalizeAndValidatePalette(
      {
        color1: '#FFFFFF',
        color2: '#F3F4F6',
        color3: '#CBD5E1',
        color4: '#1F2937',
        color5: '#111827',
        lightText: '#111827',
        darkText: '#F9FAFB',
      },
      'Test palette',
    )
    expect(palette.color1).toBe('#FFFFFF')
    expect(palette.darkText).toBe('#F9FAFB')
  })

  it('throws for low-contrast palette values', () => {
    expect(() =>
      normalizeAndValidatePalette(
        {
          color1: '#FFFFFF',
          color2: '#FFFFFF',
          color3: '#FFFFFF',
          color4: '#FFFFFF',
          color5: '#FFFFFF',
          lightText: '#FFFFFF',
          darkText: '#FFFFFF',
        },
        'Failing palette',
      ),
    ).toThrow(/failed accessibility checks/i)
  })
})
