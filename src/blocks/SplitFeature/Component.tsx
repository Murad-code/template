import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { SectionHeader } from '@/components/SectionHeader'
import type { SplitFeatureBlock as SplitFeatureBlockProps } from '@/payload-types'

export const SplitFeatureBlock: React.FC<SplitFeatureBlockProps> = (props) => {
  const {
    align,
    description,
    enableLink,
    eyebrow,
    imagePosition,
    link,
    media,
    richText,
    title,
  } = props

  const textColumn = (
    <div>
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      {richText && <RichText className="prose max-w-none" data={richText} enableGutter={false} />}
      {enableLink && link && (
        <div className="mt-6">
          <CMSLink size="lg" {...link} />
        </div>
      )}
    </div>
  )

  const mediaColumn =
    media && typeof media === 'object' ? (
      <div className="overflow-hidden rounded-2xl border border-border">
        <Media resource={media} />
      </div>
    ) : null

  return (
    <section className="container">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {imagePosition === 'left' ? (
          <>
            {mediaColumn}
            {textColumn}
          </>
        ) : (
          <>
            {textColumn}
            {mediaColumn}
          </>
        )}
      </div>
    </section>
  )
}
