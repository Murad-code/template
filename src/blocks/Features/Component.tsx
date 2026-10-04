import React from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import { RichText } from '@/components/RichText'
import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'

export const FeaturesBlock: React.FC<FeaturesBlockProps> = (props) => {
  const { align, description, eyebrow, layout, title, items } = props
  const isMinimal = layout === 'minimal'
  const isLinked = layout === 'linkedCards'

  if (!items?.length) return null

  return (
    <div className="container">
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      <div className="reveal-group grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const href = item.enableLink ? resolveLinkHref(item.link) : null
          const className = cn(
            'h-full transition-colors duration-200',
            isMinimal
              ? 'border-l-2 border-primary/50 pl-5 pr-3 py-2 hover:border-primary'
              : 'lift-card rounded-lg border border-border bg-card p-6 shadow-xs hover:border-primary/40',
            (href || isLinked) && 'group focus-visible:outline-none',
          )

          const content = (
            <>
              {item.icon && typeof item.icon === 'object' ? (
                <div className="border-border bg-background mb-4 size-10 overflow-hidden rounded-md border p-1.5">
                  <Media className="h-full w-full object-contain" resource={item.icon} />
                </div>
              ) : item.iconName ? (
                <span className="bg-muted text-primary mb-4 grid size-11 place-items-center rounded-lg">
                  <Icon name={item.iconName} />
                </span>
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
                <span className="text-body-sm text-foreground decoration-border-strong group-hover:decoration-current mt-4 inline-block font-medium underline underline-offset-4">
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
