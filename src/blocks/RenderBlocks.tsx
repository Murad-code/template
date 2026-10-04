import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HeroCarouselBlock } from '@/blocks/HeroCarousel/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { MarqueeBlock } from '@/blocks/Marquee/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import { ServiceShowcaseBlock } from '@/blocks/ServiceShowcase/Component'
import { SplitFeatureBlock } from '@/blocks/SplitFeature/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { Section } from '@/components/Section'
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
  heroCarousel: HeroCarouselBlock,
  logoCloud: LogoCloudBlock,
  marquee: MarqueeBlock,
  mediaBlock: MediaBlock,
  newsletter: NewsletterBlock,
  productShowcase: ProductShowcaseBlock,
  serviceShowcase: ServiceShowcaseBlock,
  splitFeature: SplitFeatureBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  threeItemGrid: ThreeItemGridBlock,
}

/**
 * Blocks that paint their own full-width band and manage their own spacing.
 * Wrapping these in a Section would double the padding and box in a hero
 * that is meant to run edge to edge.
 */
const SELF_CONTAINED = new Set(['heroCarousel', 'marquee'])

/**
 * Blocks that stagger their own children and so must not also fade in as one
 * block, which would hide the stagger.
 */
const SELF_ANIMATING = new Set(['features', 'stats'])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  return (
    <div className="flex flex-col">
      {blocks.map((block, index) => {
        const { blockName, blockType } = block

        if (!blockType || !(blockType in blockComponents)) return null

        const Block = blockComponents[blockType]
        if (!Block) return null

        const rendered = (
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore - weird type mismatch here
          <Block id={toKebabCase(blockName!)} {...block} />
        )

        if (SELF_CONTAINED.has(blockType)) {
          return <React.Fragment key={index}>{rendered}</React.Fragment>
        }

        const { background, spacing } = block as { background?: string; spacing?: string }

        return (
          <Section
            background={background as never}
            key={index}
            reveal={!SELF_ANIMATING.has(blockType)}
            spacing={spacing as never}
          >
            {rendered}
          </Section>
        )
      })}
    </div>
  )
}
