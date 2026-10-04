import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/cn'

const buttonVariants = cva(
  // Controls sit one radius step tighter than the surfaces holding them, so a
  // button inside a panel reads as the crisper of the two shapes. Focus comes
  // from the shared `interactive-focus` utility rather than a per-variant ring,
  // which is how it stays visible on a dark band as well as on the page.
  //
  // No variant draws an outline. A secondary action steps down by surface tone
  // — filled, then muted, then bare — so a row of buttons reads as a hierarchy
  // rather than as a filled box beside an empty one.
  'interactive-focus relative inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent text-body-sm font-medium whitespace-nowrap text-foreground transition-[background-color,border-color,color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/88',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/88',
        outline: 'bg-secondary text-secondary-foreground hover:bg-accent/60',
        subtle: 'bg-muted text-foreground hover:bg-secondary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground [&.active]:text-foreground',
        link: 'h-auto bg-transparent p-0 text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current',
      },
      size: {
        clear: '',
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-6 text-body has-[>svg]:px-5',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
