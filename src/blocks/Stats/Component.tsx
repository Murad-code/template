import React from 'react'

import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/cn'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'

export const StatsBlock: React.FC<StatsBlockProps> = (props) => {
  const { align, description, eyebrow, items, layout, title } = props

  if (!items?.length) return null

  const isBar = layout === 'bar'

  return (
    <section className="container">
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      <div
        className={cn(
          isBar
            ? 'grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-3 lg:grid-cols-4'
            : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        )}
      >
        {items.map((item, index) => (
          <div className={cn(!isBar && 'rounded-2xl border border-border bg-card p-6')} key={index}>
            <p className="text-3xl font-medium md:text-4xl">{item.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
