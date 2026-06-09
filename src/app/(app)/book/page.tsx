import { Grid } from '@/components/Grid'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { Button } from '@/components/ui/button'
import { MetaChip } from '@/components/ui/meta-chip'
import { getSiteConfig } from '@/config/site'
import configPromise from '@payload-config'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import type { Where } from 'payload'

type BookPageProps = {
  searchParams: Promise<{
    service?: string
    product?: string
    q?: string
    duration?: string
    pricing?: string
    sort?: string
  }>
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    redirect('/')
  }
  const payload = await getPayload({ config: configPromise })
  const sp = await searchParams
  const normalizedQuery = typeof sp.q === 'string' ? sp.q.trim() : ''
  const normalizedDuration = typeof sp.duration === 'string' ? sp.duration : 'all'
  const normalizedPricing = typeof sp.pricing === 'string' ? sp.pricing : 'all'
  const normalizedSort = typeof sp.sort === 'string' ? sp.sort : 'name'
  const normalizedService = typeof sp.service === 'string' ? sp.service.trim() : ''
  if (normalizedService) {
    redirect(`/book/${encodeURIComponent(normalizedService)}`)
  }

  const whereAnd: Where[] = [{ active: { equals: true } }]

  if (normalizedQuery) {
    whereAnd.push({
      or: [
        { name: { like: normalizedQuery } },
        { slug: { like: normalizedQuery } },
        { description: { like: normalizedQuery } },
      ],
    })
  }

  if (normalizedDuration === 'short') {
    whereAnd.push({ durationMinutes: { less_than_equal: 30 } })
  } else if (normalizedDuration === 'standard') {
    whereAnd.push({
      and: [
        { durationMinutes: { greater_than: 30 } },
        { durationMinutes: { less_than_equal: 60 } },
      ],
    })
  } else if (normalizedDuration === 'long') {
    whereAnd.push({ durationMinutes: { greater_than: 60 } })
  }

  if (normalizedPricing === 'free') {
    whereAnd.push({
      or: [
        { enabledPriceInGBP: { not_equals: true } },
        { priceInGBP: { exists: false } },
        { priceInGBP: { less_than_equal: 0 } },
      ],
    })
  } else if (normalizedPricing === 'paid') {
    whereAnd.push({
      and: [{ enabledPriceInGBP: { equals: true } }, { priceInGBP: { greater_than: 0 } }],
    })
  }

  const sortMap: Record<string, string> = {
    durationAsc: 'durationMinutes',
    durationDesc: '-durationMinutes',
    name: 'name',
    nameDesc: '-name',
  }
  const sortValue = sortMap[normalizedSort] ?? 'name'

  const services = await payload.find({
    collection: 'services',
    depth: 1,
    draft: false,
    limit: 100,
    sort: sortValue,
    select: {
      name: true,
      slug: true,
      description: true,
      image: true,
      durationMinutes: true,
      enabledPriceInGBP: true,
      priceInGBP: true,
      active: true,
    },
    where: { and: whereAnd },
  })

  const cmsBookPageResult = await payload.find({
    collection: 'pages',
    depth: 2,
    draft: false,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      and: [{ slug: { equals: 'book' } }, { _status: { equals: 'published' } }],
    },
  })
  const cmsBookPage = cmsBookPageResult.docs[0]

  const clearFiltersHref = '/book'
  const filterFormKey = [
    normalizedQuery,
    normalizedDuration,
    normalizedPricing,
    normalizedSort,
    sp.product ?? '',
  ].join('|')

  return (
    <div className="container py-12 space-y-8">
      {cmsBookPage ? (
        <article className="space-y-8">
          <RenderHero {...cmsBookPage.hero} />
          <RenderBlocks blocks={cmsBookPage.layout} />
        </article>
      ) : null}

      <div className="space-y-3">
        <h1 className="text-3xl font-medium">Book a service</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our available sessions, compare durations and pricing, then choose one to book your
          date and time.
        </p>
      </div>

      <form
        action="/book"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-end"
        key={filterFormKey}
      >
        <div className="xl:col-span-2">
          <label className="text-sm mb-1.5 block" htmlFor="booking-search">
            Search services
          </label>
          <input
            autoComplete="off"
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            defaultValue={normalizedQuery}
            id="booking-search"
            name="q"
            placeholder="Try consultation, coaching, strategy..."
            type="text"
          />
        </div>

        <div>
          <label className="text-sm mb-1.5 block" htmlFor="duration">
            Duration
          </label>
          <select
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            defaultValue={normalizedDuration}
            id="duration"
            name="duration"
          >
            <option value="all">All durations</option>
            <option value="short">Short (up to 30 min)</option>
            <option value="standard">Standard (31-60 min)</option>
            <option value="long">Long (60+ min)</option>
          </select>
        </div>

        <div>
          <label className="text-sm mb-1.5 block" htmlFor="pricing">
            Pricing
          </label>
          <select
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            defaultValue={normalizedPricing}
            id="pricing"
            name="pricing"
          >
            <option value="all">All options</option>
            <option value="free">Free / no payment</option>
            <option value="paid">Paid services</option>
          </select>
        </div>

        <div>
          <label className="text-sm mb-1.5 block" htmlFor="sort">
            Sort
          </label>
          <select
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            defaultValue={normalizedSort}
            id="sort"
            name="sort"
          >
            <option value="name">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
            <option value="durationAsc">Duration (shortest)</option>
            <option value="durationDesc">Duration (longest)</option>
          </select>
        </div>

        {sp.product ? <input name="product" type="hidden" value={sp.product} /> : null}

        <div className="xl:col-span-5 flex items-center gap-3">
          <button
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95"
            type="submit"
          >
            Apply filters
          </button>
          <Link className="text-sm underline underline-offset-2 hover:no-underline" href={clearFiltersHref}>
            Reset all
          </Link>
        </div>
      </form>

      {normalizedQuery ? (
        <p className="text-sm text-muted-foreground">
          Showing {services.docs.length} {services.docs.length === 1 ? 'service' : 'services'} for{' '}
          <span className="font-medium text-foreground">&quot;{normalizedQuery}&quot;</span>
        </p>
      ) : null}

      {services.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.docs.map((service) => {
            const hasPrice =
              Boolean(service.enabledPriceInGBP) &&
              typeof service.priceInGBP === 'number' &&
              service.priceInGBP > 0
            const serviceKey = service.slug ?? String(service.id)

            return (
              <Link
                className="group h-full rounded-2xl bg-card overflow-hidden flex flex-col shadow-sm shadow-black/10 dark:shadow-black/40 transition-shadow hover:shadow-md hover:shadow-black/15 dark:hover:shadow-black/50"
                key={service.id}
                href={`/book/${encodeURIComponent(serviceKey)}`}
              >
                {service.image && typeof service.image === 'object' ? (
                  <Media
                    resource={service.image}
                    className="relative aspect-4/3 bg-muted"
                    imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="relative aspect-4/3 bg-muted" />
                )}
                <article className="p-5 h-full flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <h2 className="text-lg font-medium">{service.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {service.description || 'A guided session tailored to your needs.'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MetaChip>{service.durationMinutes ?? 30} min</MetaChip>
                      <MetaChip>
                        {hasPrice && typeof service.priceInGBP === 'number' ? (
                          <span>
                            <Price amount={service.priceInGBP} as="span" /> upfront
                          </span>
                        ) : (
                          'Pay later / free'
                        )}
                      </MetaChip>
                    </div>
                  </div>

                  <Button asChild className="w-full border-transparent bg-background hover:bg-background/90">
                    <span>View details and book</span>
                  </Button>
                </article>
              </Link>
            )
          })}
        </Grid>
      ) : (
        <p className="text-muted-foreground">
          No services matched your filters. Try broadening your search or resetting filters.
        </p>
      )}

    </div>
  )
}
