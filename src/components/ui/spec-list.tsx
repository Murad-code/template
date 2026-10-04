import { cn } from '@/utilities/cn'
import React from 'react'

/**
 * A run of concrete facts: origin and weight under a product, duration and
 * capacity under a service, delivery terms under a hero.
 *
 * This is the site's one recurring ornament, and it is made of type rather
 * than decoration. Everything sold here comes with specifics, so the facts
 * themselves are given a voice — mono, small, wide-tracked, separated by
 * hairlines — instead of being dressed up as badges or icons in circles.
 *
 * The hairline between items is a CSS rule on the list (see globals.css), not
 * an element, so there is nothing for a screen reader to read out between the
 * terms.
 */
export function SpecList({
  className,
  dividers = true,
  ...props
}: React.ComponentProps<'dl'> & { dividers?: boolean }) {
  return <dl className={cn('spec-list', dividers && 'spec-list--divided', className)} {...props} />
}

/** One fact. `label` names it; set `showLabel` to print the name as well. */
export function Spec({
  children,
  className,
  label,
  showLabel = false,
}: {
  children: React.ReactNode
  className?: string
  label: string
  showLabel?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <dt className={cn(!showLabel && 'sr-only')}>{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  )
}
