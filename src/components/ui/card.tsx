import * as React from 'react'

import { cn } from '@/utilities/cn'

/**
 * The one panel surface.
 *
 * A card is a tonal step away from the page, not a rectangle with a stroke
 * around it. Outlining every panel is what makes an interface read as a
 * wireframe, and it is worst on a dark page, where any visible grey edge
 * competes with the text inside it.
 *
 * `bordered` exists for the cases where a hairline genuinely earns its place:
 * a panel sitting on a surface of its own tone, or one that has to read as a
 * discrete control. It is opt-in so that using it is a decision.
 *
 * Padding is left to `CardHeader` / `CardContent` / `CardFooter` so a dense
 * context (a cart line, an account row) can compose the parts it needs instead
 * of overriding a fixed inset.
 */
function Card({
  bordered = false,
  className,
  elevation = 'flat',
  ...props
}: React.ComponentProps<'div'> & {
  bordered?: boolean
  elevation?: 'flat' | 'raised' | 'overlay'
}) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground flex flex-col rounded-lg',
        bordered && 'border-border border',
        elevation === 'raised' && 'shadow-raised',
        elevation === 'overlay' && 'shadow-overlay',
        className,
      )}
      data-slot="card"
      {...props}
    />
  )
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

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
