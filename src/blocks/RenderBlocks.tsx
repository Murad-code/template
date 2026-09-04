import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import { ServiceShowcaseBlock } from '@/blocks/ServiceShowcase/Component'
import { SplitFeatureBlock } from '@/blocks/SplitFeature/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  features: FeaturesBlock,
  formBlock: FormBlock,
  logoCloud: LogoCloudBlock,
  mediaBlock: MediaBlock,
  newsletter: NewsletterBlock,
  productShowcase: ProductShowcaseBlock,
  serviceShowcase: ServiceShowcaseBlock,
  splitFeature: SplitFeatureBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  threeItemGrid: ThreeItemGridBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="flex flex-col gap-16 py-16">
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  return null
}
