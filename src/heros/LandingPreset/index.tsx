import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { HeroLinks } from '@/heros/shared/HeroLinks'
import { HeroTrustRow } from '@/heros/shared/HeroTrustRow'

type LandingPresetHeroProps = Page['hero']

export const LandingPresetHero: React.FC<LandingPresetHeroProps> = ({
  enableTrustRow,
  links,
  media,
  richText,
  trustItems,
  type,
}) => {
  if (type === 'landingSpotlight') {
    return (
      <section className="bg-background -mt-10 md:-mt-14">
        <div className="container py-16 md:py-24">
          <div className="border-border bg-card rounded-xl border p-8 md:p-14 lg:p-16">
            <div className="mx-auto max-w-4xl text-center">
              {richText && (
                <RichText
                  className="mb-8 [&_h1]:text-h1 [&_p]:text-body-lg [&_p]:text-muted-foreground"
                  data={richText}
                  enableGutter={false}
                />
              )}
              {Array.isArray(links) && links.length > 0 && (
                <HeroLinks className="mt-0 justify-center" links={links} />
              )}
              <HeroTrustRow enabled={enableTrustRow} items={trustItems} />
            </div>
            {media && typeof media === 'object' && (
              <div className="mt-10 overflow-hidden rounded-lg">
                <Media priority resource={media} />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="border-border bg-card rounded-xl border p-8 md:p-10">
            {richText && (
              <RichText
                className="mb-8 [&_h1]:text-h1 [&_p]:text-body-lg [&_p]:text-muted-foreground"
                data={richText}
                enableGutter={false}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <HeroLinks className="mt-0" links={links} />
            )}
            <HeroTrustRow enabled={enableTrustRow} items={trustItems} />
          </div>
          <div>
            {media && typeof media === 'object' && (
              <div className="overflow-hidden rounded-lg">
                <Media priority resource={media} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
