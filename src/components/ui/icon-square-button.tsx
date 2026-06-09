import * as React from 'react'
import { cn } from '@/utilities/cn'

type IconSquareButtonProps = React.ComponentProps<'button'>

export const IconSquareButton = React.forwardRef<HTMLButtonElement, IconSquareButtonProps>(
  ({ className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className,
        )}
        {...props}
      />
    )
  },
)

IconSquareButton.displayName = 'IconSquareButton'
