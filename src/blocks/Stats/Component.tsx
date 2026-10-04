import React from 'react'

import { Icon } from '@/components/Icon'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/cn'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'

/**
 * One number with optional decoration either side: `8%`, `£69.99`, `10+`.
 * Anything else, such as `24/7`, has no single number to count towards and is
 * left exactly as the editor typed it.
 */
const COUNTABLE = /^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/

const countable = (value: string) => {
  const match = COUNTABLE.exec(value.trim())
  if (!match) return null
  return { prefix: match[1] ?? '', suffix: match[3] ?? '', to: match[2]! }
}

export const StatsBlock: React.FC<StatsBlockProps> = (props) => {
  const { align, countUp, description, eyebrow, items, layout, title } = props

  if (!items?.length) return null

  const isBar = layout === 'bar'

  return (
    <div className="container">
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      <dl
        className={cn(
          'reveal-group',
          isBar
            ? 'grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-3 lg:grid-cols-4'
            : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        )}
      >
        {items.map((item, index) => {
          const counter = countUp ? countable(item.value) : null

          return (
            <div
              className={cn(
                !isBar &&
                  'rounded-2xl border border-border bg-card p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40',
              )}
              key={index}
            >
              {item.iconName && (
                <span className="bg-muted text-primary mb-4 grid size-11 place-items-center rounded-lg">
                  <Icon name={item.iconName} />
                </span>
              )}
              {/* Reversed so the figure reads first while the markup keeps the
                  term before its description. */}
              <div className="flex flex-col-reverse">
                <dt className="text-muted-foreground mt-2 text-sm">{item.label}</dt>
                {/* Rendered at its final value, so it is correct before any
                    script runs and correct for anyone who has asked for less
                    motion. `Motion` counts it up only when it scrolls in. */}
                <dd
                  className="text-3xl font-medium md:text-4xl"
                  {...(counter
                    ? {
                        'data-count-prefix': counter.prefix,
                        'data-count-suffix': counter.suffix,
                        'data-count-to': counter.to,
                      }
                    : {})}
                >
                  {item.value}
                </dd>
              </div>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
