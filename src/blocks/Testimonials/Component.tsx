import React from 'react'

import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import { TestimonialsCarousel } from './Component.client'

function Stars({ rating }: { rating?: number | null }) {
  if (!rating) return null

  return (
    <div aria-label={`${rating} out of 5 stars`} className="mb-3 flex gap-1 text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < rating ? '★' : '☆'}</span>
      ))}
    </div>
  )
}

function TestimonialCard({
  author,
  photo,
  quote,
  rating,
  role,
}: NonNullable<TestimonialsBlockProps['items']>[number]) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <Stars rating={rating} />
      <blockquote className="flex-1 text-base leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {photo && typeof photo === 'object' && (
          <Media className="size-12 overflow-hidden rounded-full" resource={photo} />
        )}
        <div>
          <p className="font-medium">{author}</p>
          {role && <p className="text-sm text-muted-foreground">{role}</p>}
        </div>
      </figcaption>
    </figure>
  )
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = (props) => {
  const { align, description, eyebrow, items, layout, title } = props

  if (!items?.length) return null

  return (
    <section className="container">
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      {layout === 'carousel' ? (
        <TestimonialsCarousel items={items} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <TestimonialCard key={index} {...item} />
          ))}
        </div>
      )}
    </section>
  )
}
