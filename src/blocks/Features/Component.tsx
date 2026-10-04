import React from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import { RichText } from '@/components/RichText'
import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'

type FeatureItem = NonNullable<FeaturesBlockProps['items']>[number]

/**
 * Icons are drawn plain, at text weight, rather than dropped into a filled
 * chip. A grid of coloured icon tiles is the fastest way to make six unrelated
 * sentences look like a pricing table.
 */
function FeatureIcon({ item }: { item: FeatureItem }) {
  if (item.icon && typeof item.icon === 'object') {
    return (
      <Media
        className="size-6 shrink-0"
        imgClassName="h-full w-full object-contain"
        resource={item.icon}
        size="24px"
      />
    )
  }

  if (item.iconName) {
    return (
      <span className="text-muted-foreground shrink-0">
        <Icon name={item.iconName} />
      </span>
    )
  }

  return null
}

function FeatureBody({ item, href }: { item: FeatureItem; href: string | null }) {
  return (
    <>
      <h3 className="text-h4">{item.title}</h3>
      {item.description && (
        <div className="text-muted-foreground text-body-sm mt-2 [&_p]:text-muted-foreground">
          <RichText data={item.description} enableGutter={false} />
        </div>
      )}
      {href ? (
        <span className="text-body-sm text-foreground decoration-border-strong group-hover:decoration-current mt-4 inline-block font-medium underline underline-offset-4">
          {item.link?.label || 'Explore'}
        </span>
      ) : null}
    </>
  )
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = (props) => {
  const { align, description, eyebrow, layout, title, items } = props

  if (!items?.length) return null

  const isMinimal = layout === 'minimal'
  const isLinked = layout === 'linkedCards'

  return (
    <div className="container">
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />

      {/* The three layouts are genuinely different structures rather than the
          same card with different padding. `minimal` is a ruled list, which is
          what most of these sections actually are: a set of statements, not a
          set of destinations. Cards are for items worth clicking. */}
      <div
        className={cn(
          'reveal-group',
          isMinimal
            ? 'grid sm:grid-cols-2 sm:gap-x-12'
            : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {items.map((item, i) => {
          const href = item.enableLink ? resolveLinkHref(item.link) : null
          const linkProps = item.link?.newTab
            ? { rel: 'noopener noreferrer', target: '_blank' }
            : {}

          if (isMinimal) {
            return (
              <div className="border-border flex gap-4 border-t py-6" key={i}>
                <FeatureIcon item={item} />
                <div className="min-w-0">
                  {href ? (
                    <Link className="group interactive-focus block" href={href} {...linkProps}>
                      <FeatureBody href={href} item={item} />
                    </Link>
                  ) : (
                    <FeatureBody href={null} item={item} />
                  )}
                </div>
              </div>
            )
          }

          const cardClassName = cn(
            'border-border bg-card flex h-full flex-col rounded-lg border p-6 transition-colors',
            (href || isLinked) && 'group interactive-focus hover:border-border-strong',
          )

          const card = (
            <>
              <FeatureIcon item={item} />
              <div className={cn(item.icon || item.iconName ? 'mt-4' : undefined)}>
                <FeatureBody href={href} item={item} />
              </div>
            </>
          )

          if (href) {
            return (
              <Link className={cardClassName} href={href} key={i} {...linkProps}>
                {card}
              </Link>
            )
          }

          return (
            <div className={cardClassName} key={i}>
              {card}
            </div>
          )
        })}
      </div>
    </div>
  )
}
