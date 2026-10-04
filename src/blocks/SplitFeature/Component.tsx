import { Check } from 'lucide-react'
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
    kenBurns,
    link,
    media,
    points,
    richText,
    title,
  } = props

  const textColumn = (
    <div>
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      {richText && <RichText className="prose max-w-none" data={richText} enableGutter={false} />}
      {Boolean(points?.length) && (
        <ul className="mt-6 space-y-3">
          {points?.map((point, index) => (
            <li className="flex gap-3" key={index}>
              <Check aria-hidden="true" className="text-primary mt-1 size-5 shrink-0" />
              <span>{point.text}</span>
            </li>
          ))}
        </ul>
      )}
      {enableLink && link && (
        <div className="mt-6">
          <CMSLink size="lg" {...link} />
        </div>
      )}
    </div>
  )

  const mediaColumn =
    media && typeof media === 'object' ? (
      <div className="bg-muted overflow-hidden rounded-xl">
        <Media className={kenBurns ? 'ken-burns' : undefined} resource={media} />
      </div>
    ) : null

  return (
    <div className="container">
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
    </div>
  )
}
