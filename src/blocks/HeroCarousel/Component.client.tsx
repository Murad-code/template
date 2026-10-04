'use client'

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/cn'

/**
 * The page banner.
 *
 * One slide renders as a still hero and costs nothing extra; two or more
 * rotate. Photos cross-fade; the copy does not, because two headings in the
 * same grid cell overlap. No carousel library: the slides are stacked in a
 * single grid cell so the band is always as tall as its tallest slide and
 * never jumps as it rotates.
 *
 * Auto-rotation stops on hover, on focus and for anyone who has asked their
 * device to reduce motion, and there is always a visible pause control, which
 * is what WCAG 2.2.2 asks of anything that moves on its own for more than
 * five seconds.
 */

type HeroLink = NonNullable<React.ComponentProps<typeof CMSLink>>

export type HeroSlide = {
  heading: string
  id: string
  imageAlt?: string | null
  imageUrl?: string | null
  links?: HeroLink[]
  subheading?: string | null
}

type Highlight = { description?: string | null; id: string; title: string }

/** How long a slide holds before the next one fades in. */
const INTERVAL_MS = 6500

/** Below this the drag reads as a tap rather than a swipe. */
const SWIPE_PX = 50

const HEIGHTS = {
  full: 'min-h-screen',
  standard: 'min-h-[32rem]',
  tall: 'min-h-[42rem]',
} as const

/**
 * The hero is already on screen when the page loads, so its parts arrive on a
 * clock rather than on scroll. The delays are hand-picked rather than evenly
 * spaced: the gap after the heading is the longest, because that is the line
 * the visitor is actually reading.
 */
const rise = (delayMs: number) => ({ '--rise-delay': `${delayMs}ms` }) as React.CSSProperties

export const HeroCarouselClient: React.FC<{
  autoplay?: boolean
  highlights?: Highlight[]
  minHeight?: 'standard' | 'tall' | 'full' | string
  slides: HeroSlide[]
}> = ({ autoplay = true, highlights = [], minHeight = 'tall', slides }) => {
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const count = slides.length
  const many = count > 1

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + count) % count),
    [count],
  )

  const rotating = many && autoplay && playing && !held && !reducedMotion

  useEffect(() => {
    if (!rotating) return
    const timer = window.setInterval(() => setIndex((c) => (c + 1) % count), INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [rotating, count])

  if (!count) return null

  const height = HEIGHTS[minHeight as keyof typeof HEIGHTS] ?? HEIGHTS.tall

  return (
    <section
      aria-label={many ? 'Highlights' : undefined}
      aria-roledescription={many ? 'carousel' : undefined}
      className={cn('bg-primary relative isolate flex flex-col justify-center overflow-hidden', height)}
      data-tone="inverse"
      onBlur={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onKeyDown={(event) => {
        if (!many) return
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          go(-1)
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          go(1)
        }
      }}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onTouchEnd={(event) => {
        const start = touchStartX.current
        touchStartX.current = null
        if (start === null || !many) return
        const travelled = (event.changedTouches[0]?.clientX ?? start) - start
        if (Math.abs(travelled) > SWIPE_PX) go(travelled < 0 ? 1 : -1)
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
    >
      {/* One wrapper around every slide so the scroll-linked push-in is
          written once rather than per slide. The photo inside also drifts on
          its own slow cycle, which is the whole reason a still hero stops
          feeling like a screenshot. */}
      <div aria-hidden="true" className="hero-scrub-bg absolute inset-0">
        {slides.map((slide, position) =>
          slide.imageUrl ? (
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-out',
                position === index ? 'opacity-100' : 'opacity-0',
              )}
              key={slide.id}
            >
              <Image
                alt=""
                className="ken-burns object-cover"
                fill
                priority={position === 0}
                sizes="100vw"
                src={slide.imageUrl}
              />
            </div>
          ) : null,
        )}
      </div>

      {/* Wash so the heading keeps its contrast whatever photo is uploaded. */}
      <div
        aria-hidden="true"
        className="from-primary/95 via-primary/80 to-primary/50 absolute inset-0 bg-gradient-to-r"
      />

      {many && (
        <>
          <button
            className="hero-scrub-content border-border bg-primary/40 text-primary-foreground hover:bg-primary/75 absolute top-1/2 left-4 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-sm transition-colors lg:grid"
            onClick={() => go(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            className="hero-scrub-content border-border bg-primary/40 text-primary-foreground hover:bg-primary/75 absolute top-1/2 right-4 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-sm transition-colors lg:grid"
            onClick={() => go(1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
            <span className="sr-only">Next slide</span>
          </button>
        </>
      )}

      <div className="relative" data-tone-scope="">
        <div className="hero-scrub-content container pt-20 sm:pt-28 lg:pt-32">
          <div aria-live={rotating ? 'off' : 'polite'} className="grid">
            {slides.map((slide, position) => {
              const active = position === index
              // Exactly one h1 whichever slide happens to be showing.
              const Heading = position === 0 ? 'h1' : 'p'

              return (
                <div
                  aria-hidden={!active}
                  aria-label={many ? `Slide ${position + 1} of ${count}` : undefined}
                  aria-roledescription={many ? 'slide' : undefined}
                  className={cn('hero-slide-copy max-w-2xl [grid-area:1/1]', active && 'is-active')}
                  inert={!active}
                  key={slide.id}
                  role={many ? 'group' : undefined}
                >
                  {/* The heading rises from behind its own box rather than
                      fading in. Two elements and one keyframe, and it is the
                      single most effective thing in the motion system. */}
                  <Heading className="text-4xl leading-[1.12] font-semibold tracking-[-0.015em] text-balance sm:text-5xl lg:text-[3.5rem]">
                    <span className="rise-mask">
                      <span>{slide.heading}</span>
                    </span>
                  </Heading>
                  {slide.subheading && (
                    <p className="rise text-muted-foreground mt-6 text-lg sm:text-xl" style={rise(600)}>
                      {slide.subheading}
                    </p>
                  )}
                  {Boolean(slide.links?.length) && (
                    <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={rise(750)}>
                      {slide.links?.map((link, linkIndex) => (
                        <CMSLink
                          key={linkIndex}
                          {...link}
                          appearance={linkIndex === 0 ? 'default' : 'outline'}
                          size="lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {many && (
            <div className="rise mt-8 flex items-center gap-1" style={rise(900)}>
              <ul className="flex items-center gap-1">
                {slides.map((slide, position) => (
                  <li key={slide.id}>
                    <button
                      aria-current={position === index ? 'true' : undefined}
                      className="group flex h-11 items-center px-1.5"
                      onClick={() => setIndex(position)}
                      type="button"
                    >
                      <span
                        className={cn(
                          'block h-2 rounded-full transition-all duration-300',
                          position === index
                            ? 'bg-accent w-9'
                            : 'bg-foreground/45 group-hover:bg-foreground/80 w-2',
                        )}
                      />
                      <span className="sr-only">Show slide {position + 1}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {autoplay && (
                <button
                  className="border-border text-muted-foreground hover:bg-muted hover:text-foreground ml-2 grid size-9 place-items-center rounded-full border transition-colors"
                  onClick={() => setPlaying((current) => !current)}
                  type="button"
                >
                  {playing ? (
                    <Pause aria-hidden="true" className="size-3.5" />
                  ) : (
                    <Play aria-hidden="true" className="size-3.5" />
                  )}
                  <span className="sr-only">
                    {playing ? 'Stop the slides moving' : 'Let the slides move again'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Outside the heading scrub, so the cards do not fade on scroll. */}
        {Boolean(highlights.length) && (
          <div className="relative z-10 container pt-12 pb-20 sm:pb-28 lg:pb-32">
            <ul className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <li className="border-border bg-card rounded-xl border p-5 backdrop-blur-sm" key={item.id}>
                  <p className="font-semibold">{item.title}</p>
                  {item.description && (
                    <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!highlights.length && <div className="pb-20 sm:pb-28 lg:pb-32" />}
      </div>
    </section>
  )
}
