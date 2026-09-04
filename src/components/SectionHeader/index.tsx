import { cn } from '@/utilities/cn'
import React from 'react'

type SectionHeaderProps = {
  align?: 'left' | 'center' | null | undefined
  className?: string
  description?: string | null
  eyebrow?: string | null
  title?: string | null
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  align = 'left',
  className,
  description,
  eyebrow,
  title,
}) => {
  if (!eyebrow && !title && !description) return null

  return (
    <div
      className={cn(
        'mb-8 max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
      )}
      {title && <h2 className="text-2xl font-medium md:text-3xl">{title}</h2>}
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  )
}
