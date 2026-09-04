'use client'

import React from 'react'

import { Media } from '@/components/Media'
import type { TestimonialsBlock } from '@/payload-types'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type Item = NonNullable<TestimonialsBlock['items']>[number]

export const TestimonialsCarousel: React.FC<{ items: Item[] }> = ({ items }) => {
  return (
    <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              {item.rating ? (
                <div className="mb-3 flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex}>{starIndex < item.rating! ? '★' : '☆'}</span>
                  ))}
                </div>
              ) : null}
              <blockquote className="flex-1 text-base leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {item.photo && typeof item.photo === 'object' && (
                  <Media className="size-12 overflow-hidden rounded-full" resource={item.photo} />
                )}
                <div>
                  <p className="font-medium">{item.author}</p>
                  {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
                </div>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
