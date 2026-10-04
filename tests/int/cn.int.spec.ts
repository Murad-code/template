import { describe, expect, it } from 'vitest'

import { cn } from '@/utilities/cn'

describe('cn', () => {
  // Regression: tailwind-merge cannot see the theme, so without the class
  // group extension it read `text-h2` and `text-muted-foreground` as the same
  // group and dropped one. That silently removed label colours from buttons.
  it('keeps a type-scale size and a text colour together', () => {
    expect(cn('text-body-sm', 'text-primary-foreground')).toBe(
      'text-body-sm text-primary-foreground',
    )
    expect(cn('text-h2', 'text-muted-foreground')).toBe('text-h2 text-muted-foreground')
  })

  it('still resolves two sizes from the scale down to the last one', () => {
    expect(cn('text-body-sm', 'text-body')).toBe('text-body')
    expect(cn('text-h1', 'text-display')).toBe('text-display')
  })

  it('resolves the scale against built-in sizes', () => {
    expect(cn('text-sm', 'text-h3')).toBe('text-h3')
  })

  it('treats the elevation tokens as shadows', () => {
    expect(cn('shadow-raised', 'shadow-overlay')).toBe('shadow-overlay')
  })
})
