import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'

type LandingPresetHeroProps = Page['hero']

export const LandingPresetHero: React.FC<LandingPresetHeroProps> = ({ links, media, richText, type }) => {
  if (type === 'landingSpotlight') {
    return (
      <section className="-mt-10 bg-[var(--landing-background)] md:-mt-14">
        <div className="container py-16 md:py-24">
          <div className="rounded-2xl bg-[var(--landing-card-background)] p-8 md:p-14 lg:p-16 shadow-sm shadow-black/10 dark:shadow-black/40">
            <div className="mx-auto max-w-4xl text-center">
              {richText && (
                <RichText
                  className="mb-8 [&_h1]:text-[var(--landing-heading)] [&_h2]:text-[var(--landing-heading)] [&_h3]:text-[var(--landing-heading)] [&_h4]:text-[var(--landing-heading)] [&_p]:text-[var(--landing-body)]"
                  data={richText}
                  enableGutter={false}
                />
              )}
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex flex-wrap justify-center gap-3">
                  {links.map(({ link }, index) => (
                    <li key={index}>
                      <CMSLink {...link} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {media && typeof media === 'object' && (
              <div className="mt-10 overflow-hidden rounded-xl shadow-sm shadow-black/10 dark:shadow-black/40">
                <Media priority resource={media} />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[var(--landing-background)]">
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-[var(--landing-card-background)] p-8 md:p-10 shadow-sm shadow-black/10 dark:shadow-black/40">
            {richText && (
              <RichText
                className="mb-8 [&_h1]:text-[var(--landing-heading)] [&_h2]:text-[var(--landing-heading)] [&_h3]:text-[var(--landing-heading)] [&_h4]:text-[var(--landing-heading)] [&_p]:text-[var(--landing-body)]"
                data={richText}
                enableGutter={false}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex flex-wrap gap-3">
                {links.map(({ link }, index) => (
                  <li key={index}>
                    <CMSLink {...link} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {media && typeof media === 'object' && (
              <div className="overflow-hidden rounded-2xl shadow-sm shadow-black/10 dark:shadow-black/40">
                <Media priority resource={media} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
