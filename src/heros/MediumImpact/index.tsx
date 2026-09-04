import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { HeroLinks } from '@/heros/shared/HeroLinks'
import { HeroTrustRow } from '@/heros/shared/HeroTrustRow'
import { heroRichTextClassName } from '@/heros/shared/heroStyles'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  enableTrustRow,
  links,
  media,
  richText,
  trustItems,
}) => {
  return (
    <div>
      <div className="container mb-8">
        {richText && (
          <RichText className={heroRichTextClassName} data={richText} enableGutter={false} />
        )}
        <HeroLinks links={links} />
        <HeroTrustRow enabled={enableTrustRow} items={trustItems} />
      </div>
      <div className="container">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName="rounded-2xl"
              priority
              resource={media}
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
