import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/cn'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent text-sm font-medium text-foreground transition-[background-color,color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_6px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_3px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.07)] active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.06)] [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground hover:bg-muted/70',
        destructive:
          'border-destructive/30 bg-destructive text-destructive-foreground hover:bg-destructive/85 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline: 'border-border bg-background text-foreground hover:bg-muted/65',
        subtle: 'bg-card text-card-foreground hover:bg-muted/75',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted/60 hover:text-foreground hover:shadow-none active:translate-y-0 active:shadow-none [&.active]:text-foreground',
        link:
          'border-transparent bg-transparent p-0 text-primary underline-offset-4 shadow-none hover:bg-transparent hover:text-primary/85 hover:underline hover:shadow-none active:translate-y-0 active:shadow-none',
        nav: 'border-transparent bg-transparent p-0 pt-2 pb-6 font-mono text-xs uppercase tracking-widest text-primary/50 shadow-none hover:bg-transparent hover:text-primary hover:shadow-none [&.active]:text-primary active:translate-y-0 active:shadow-none',
      },
      size: {
        clear: '',
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
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
