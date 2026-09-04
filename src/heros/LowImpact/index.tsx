import React from 'react'

import type { Page } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { HeroLinks } from '@/heros/shared/HeroLinks'
import { HeroTrustRow } from '@/heros/shared/HeroTrustRow'
import { heroRichTextClassName } from '@/heros/shared/heroStyles'

type LowImpactHeroProps = Page['hero'] & {
  children?: React.ReactNode
}

export const LowImpactHero: React.FC<LowImpactHeroProps> = ({
  children,
  enableTrustRow,
  links,
  richText,
  trustItems,
}) => {
  return (
    <div className="container mt-16">
      <div className="max-w-3xl">
        {children ||
          (richText && (
            <RichText className={heroRichTextClassName} data={richText} enableGutter={false} />
          ))}
        <HeroLinks links={links} />
        <HeroTrustRow enabled={enableTrustRow} items={trustItems} />
      </div>
    </div>
  )
}
