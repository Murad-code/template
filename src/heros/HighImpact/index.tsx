'use client'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { HeroLinks } from '@/heros/shared/HeroLinks'
import { HeroTrustRow } from '@/heros/shared/HeroTrustRow'
import { heroRichTextClassName } from '@/heros/shared/heroStyles'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/cn'

export const HighImpactHero: React.FC<Page['hero']> = ({
  enableTrustRow,
  links,
  media,
  richText,
  trustItems,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    /* The copy sits on a photograph, so it takes the media tone: the deep
       brand tone and light copy, identical in both themes, because the
       picture underneath does not change when the page around it does.
       `data-theme="dark"` used to do this, borrowing the whole dark palette
       to say one thing. */
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center"
      data-tone="media"
    >
      <div
        className="container relative z-10 mb-8 flex items-center justify-center"
        data-tone-scope=""
      >
        <div className="max-w-146 md:text-center">
          {richText && (
            <RichText
              className={cn('mb-6', heroRichTextClassName)}
              data={richText}
              enableGutter={false}
            />
          )}
          <div className="flex flex-col md:items-center">
            <HeroLinks links={links} />
            <HeroTrustRow enabled={enableTrustRow} items={trustItems} />
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
