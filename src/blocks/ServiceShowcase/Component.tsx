import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { SectionHeader } from '@/components/SectionHeader'
import { getSiteConfig } from '@/config/site'
import { fetchServicesForBlock } from '@/utilities/fetchServicesForBlock'
import type { ServiceShowcaseBlock as ServiceShowcaseBlockProps } from '@/payload-types'
import Link from 'next/link'

export const ServiceShowcaseBlock: React.FC<ServiceShowcaseBlockProps> = async (props) => {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) return null

  const {
    align,
    description,
    enableViewAllLink,
    eyebrow,
    limit,
    link,
    populateBy,
    selectedDocs,
    title,
  } = props

  const services = await fetchServicesForBlock({
    limit,
    populateBy,
    selectedDocs,
  })

  if (!services.length) return null

  return (
    <section className="container">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          align={align}
          className="mb-0"
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
        {enableViewAllLink && link && <CMSLink {...link} appearance="outline" className="shrink-0" />}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const hasPrice =
            Boolean(service.enabledPriceInGBP) &&
            typeof service.priceInGBP === 'number' &&
            service.priceInGBP > 0
          const serviceKey = service.slug ?? String(service.id)

          return (
            <Link
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40"
              href={`/book/${encodeURIComponent(serviceKey)}`}
              key={service.id}
            >
              {service.image && typeof service.image === 'object' ? (
                <Media
                  className="relative aspect-[4/3] bg-muted"
                  imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  resource={service.image}
                />
              ) : (
                <div className="relative aspect-[4/3] bg-muted" />
              )}
              <article className="flex h-full flex-col justify-between gap-4 p-5">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description || 'A guided session tailored to your needs.'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border px-2.5 py-1">
                      {service.durationMinutes ?? 30} min
                    </span>
                    <span className="rounded-full border px-2.5 py-1">
                      {hasPrice && typeof service.priceInGBP === 'number' ? (
                        <>
                          <Price amount={service.priceInGBP} as="span" /> upfront
                        </>
                      ) : (
                        'Pay later / free'
                      )}
                    </span>
                  </div>
                </div>
                <span className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium group-hover:bg-muted">
                  View details and book
                </span>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
