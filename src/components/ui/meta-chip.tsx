import * as React from 'react'

import { cn } from '@/utilities/cn'

type MetaChipProps = React.ComponentProps<'span'>

export function MetaChip({ className, ...props }: MetaChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-background px-2.5 py-1 shadow-sm shadow-black/10 ring-1 ring-black/5 dark:shadow-black/30 dark:ring-white/10',
        className,
      )}
      {...props}
    />
  )
}
