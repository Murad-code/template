import * as React from 'react'

import { cn } from '@/utilities/cn'

/**
 * The one panel surface.
 *
 * `elevation` is the only axis, and it is deliberately short. A static panel
 * separates from the page by a hairline and a tonal step; a shadow is reserved
 * for things genuinely floating above the page, which on this site means
 * dialogs, sheets and menus. Giving every card a drop shadow is most of what
 * makes a page look assembled rather than designed.
 *
 * Padding is left to `CardHeader` / `CardContent` / `CardFooter` so a dense
 * context (a cart line, an account row) can compose the parts it needs instead
 * of overriding a fixed inset.
 */
function Card({
  className,
  elevation = 'flat',
  ...props
}: React.ComponentProps<'div'> & { elevation?: 'flat' | 'raised' | 'overlay' }) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground flex flex-col rounded-lg border border-border',
        elevation === 'raised' && 'shadow-raised',
        elevation === 'overlay' && 'shadow-overlay',
        className,
      )}
      data-slot="card"
      {...props}
    />
  )
}

/**
 * A card with no edge of its own, for panels that are already separated by
 * the band they sit on. Same shape and spacing, one less line.
 */
function CardPlain({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn('border-transparent bg-card', className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-6 pb-0', className)}
      data-slot="card-header"
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-h4', className)} data-slot="card-title" {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground text-body-sm', className)}
      data-slot="card-description"
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-6', className)} data-slot="card-content" {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      data-slot="card-footer"
      {...props}
    />
  )
}

export { Card, CardPlain, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
