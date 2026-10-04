import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Spec, SpecList } from '@/components/ui/spec-list'
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
        {enableViewAllLink && link && (
          <CMSLink {...link} appearance="outline" className="shrink-0" />
        )}
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
              className="group interactive-focus bg-card hover:bg-secondary flex h-full flex-col overflow-hidden rounded-lg transition-colors"
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
                  <h3 className="text-h4">{service.name}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {service.description || 'A guided session tailored to your needs.'}
                  </p>
                  <SpecList>
                    <Spec label="Duration">{service.durationMinutes ?? 30} min</Spec>
                    <Spec label="Price">
                      {hasPrice && typeof service.priceInGBP === 'number' ? (
                        <>
                          <Price amount={service.priceInGBP} as="span" /> upfront
                        </>
                      ) : (
                        'Pay later / free'
                      )}
                    </Spec>
                  </SpecList>
                </div>
                <span className="bg-muted text-body-sm group-hover:bg-background inline-flex h-10 items-center justify-center rounded-sm px-4 font-medium transition-colors">
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
