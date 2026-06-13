import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { SurfaceCard } from '@/components/ui/surface-card'

export const CallToActionBlock: React.FC<
  CTABlockProps & {
    id?: string | number
    className?: string
  }
> = ({ layout, links, richText }) => {
  const isSplit = layout === 'splitPanel'

  return (
    <div className="container">
      <SurfaceCard
        className={`${isSplit ? 'bg-linear-to-r from-card to-muted p-6 md:p-8' : 'p-4 md:flex-row md:items-center md:justify-between'} rounded border-0 shadow-sm shadow-black/10 dark:shadow-black/40 flex flex-col gap-8`}
      >
        <div className={`flex items-center ${isSplit ? 'max-w-2xl' : 'max-w-3xl'}`}>
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className={`flex ${isSplit ? 'flex-wrap gap-3' : 'flex-col gap-8'}`}>
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </SurfaceCard>
    </div>
  )
}
