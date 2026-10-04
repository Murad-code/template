import React from 'react'

import { cn } from '@/utilities/cn'

export type SectionBackground = 'default' | 'muted' | 'soft' | 'inverse'
export type SectionSpacing = 'default' | 'tight' | 'loose' | 'none'

const BACKGROUNDS: Record<SectionBackground, string> = {
  default: '',
  muted: 'bg-muted',
  soft: 'bg-surface-soft-panel',
  inverse: 'bg-primary',
}

const SPACING: Record<SectionSpacing, string> = {
  default: 'py-14 sm:py-20',
  tight: 'py-10 sm:py-14',
  loose: 'py-20 sm:py-28',
  none: '',
}

/**
 * A full-width band of colour with consistent vertical rhythm.
 *
 * Blocks keep their own `container`; this only supplies the band and the
 * padding, so wrapping an existing block in one changes nothing but its
 * surroundings.
 *
 * `data-tone="inverse"` remaps the theme tokens for everything inside (see
 * globals.css), which is what lets any block sit on a dark band without
 * knowing it is on one.
 */
export const Section: React.FC<{
  background?: SectionBackground | null
  children: React.ReactNode
  className?: string
  id?: string
  /**
   * Fade the contents up as the band scrolls into view. Off when something
   * inside animates on its own terms: a grid using `reveal-group` staggers
   * its own children, and a parent fading as one would hide that.
   */
  reveal?: boolean
  spacing?: SectionSpacing | null
}> = ({ background, children, className, id, reveal = true, spacing }) => {
  const tone = background ?? 'default'

  return (
    <section
      className={cn(BACKGROUNDS[tone], SPACING[spacing ?? 'default'], className)}
      data-tone={tone === 'inverse' ? 'inverse' : undefined}
      id={id}
    >
      {/* The reveal goes inside the band, never on it: transforming the
          section would drag its background colour with it. This element is
          also the inverse-tone scope (see globals.css). */}
      <div className={cn(reveal && 'reveal')} data-tone-scope="">
        {children}
      </div>
    </section>
  )
}
