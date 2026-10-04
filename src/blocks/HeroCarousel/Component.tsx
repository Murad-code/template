import React from 'react'

import type { HeroCarouselBlock as HeroCarouselBlockProps } from '@/payload-types'

import { HeroCarouselClient, type HeroSlide } from './Component.client'

export const HeroCarouselBlock: React.FC<HeroCarouselBlockProps & { id?: string }> = (props) => {
  const { autoplay, highlights, minHeight, slides } = props

  const resolved: HeroSlide[] = (slides ?? []).map((slide, position) => {
    const image = typeof slide.image === 'object' && slide.image ? slide.image : null

    return {
      heading: slide.heading,
      id: slide.id ?? String(position),
      imageAlt: image?.alt ?? '',
      imageUrl: image?.url ?? null,
      links: (slide.links ?? []).map((entry) => entry.link),
      subheading: slide.subheading ?? null,
    }
  })

  if (!resolved.length) return null

  return (
    <HeroCarouselClient
      autoplay={autoplay !== false}
      highlights={(highlights ?? []).map((item, position) => ({
        description: item.description ?? null,
        id: item.id ?? String(position),
        title: item.title,
      }))}
      minHeight={minHeight ?? 'tall'}
      slides={resolved}
    />
  )
}
