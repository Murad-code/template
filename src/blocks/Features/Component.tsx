import React from 'react'
import { RichText } from '@/components/RichText'
import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'

export const FeaturesBlock: React.FC<FeaturesBlockProps> = (props) => {
  const { layout, title, items } = props
  const isMinimal = layout === 'minimal'

  if (!items?.length) return null
  return (
    <div className="container my-16">
      {title && <h2 className="text-2xl font-medium mb-8">{title}</h2>}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={
              isMinimal
                ? 'border-l-2 border-primary/40 pl-5 pr-3 py-1'
                : 'rounded-lg bg-card p-6 shadow-sm shadow-black/10 dark:shadow-black/40'
            }
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            {item.description && <RichText data={item.description} enableGutter={false} />}
          </div>
        ))}
      </div>
    </div>
  )
}
