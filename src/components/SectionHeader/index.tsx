import { cn } from '@/utilities/cn'
import React from 'react'

type SectionHeaderProps = {
  align?: 'left' | 'center' | null | undefined
  className?: string
  description?: string | null
  eyebrow?: string | null
  title?: string | null
}

/**
 * The standard opening to a section.
 *
 * The eyebrow is set in the specification voice rather than as a badge, which
 * keeps it reading as a category label and not as an award. Width is capped at
 * the prose measure so a long description never runs the full width of a wide
 * band.
 */
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
      className={cn('mb-10 max-w-prose', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && <p className="spec-list text-muted-foreground mb-3">{eyebrow}</p>}
      {title && <h2 className="text-h2">{title}</h2>}
      {description && <p className="text-body-lg text-muted-foreground mt-4">{description}</p>}
    </div>
  )
}
