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
          'interactive-focus bg-muted text-foreground hover:bg-secondary relative inline-flex size-10 items-center justify-center rounded-sm transition-colors',
          className,
        )}
        {...props}
      />
    )
  },
)

IconSquareButton.displayName = 'IconSquareButton'
