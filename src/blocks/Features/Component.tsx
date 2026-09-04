import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'

export const FeaturesBlock: React.FC<FeaturesBlockProps> = (props) => {
  const { layout, title, items } = props
  const isMinimal = layout === 'minimal'
  const isLinked = layout === 'linkedCards'

  if (!items?.length) return null

  return (
    <div className="container">
      {title && <h2 className="text-2xl font-medium mb-8">{title}</h2>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const href = item.enableLink ? resolveLinkHref(item.link) : null
          const className = cn(
            'h-full transition-colors duration-200',
            isMinimal
              ? 'border-l-2 border-primary/50 pl-5 pr-3 py-2 hover:border-primary'
              : 'rounded-lg border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:bg-accent/40',
            (href || isLinked) && 'group focus-visible:outline-none',
          )

          const content = (
            <>
              {item.icon && typeof item.icon === 'object' ? (
                <div className="mb-4 size-10 overflow-hidden rounded-md border border-border bg-background p-1.5">
                  <Media className="h-full w-full object-contain" resource={item.icon} />
                </div>
              ) : null}
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              {item.description && (
                <div className="text-muted-foreground [&_p]:text-muted-foreground">
                  <RichText data={item.description} enableGutter={false} />
                </div>
              )}
              {href ? (
                <span className="mt-4 inline-block text-sm font-medium text-primary opacity-80 group-hover:opacity-100">
                  {item.link?.label || 'Explore'} →
                </span>
              ) : null}
            </>
          )

          if (href) {
            return (
              <Link
                className={className}
                href={href}
                key={i}
                {...(item.link?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
              >
                {content}
              </Link>
            )
          }

          return (
            <div className={className} key={i}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
