import { BookingForm } from '@/components/BookingForm'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { getSiteConfig } from '@/config/site'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

type ServiceBookingPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ product?: string }>
}

export default async function ServiceBookingPage({ params, searchParams }: ServiceBookingPageProps) {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    redirect('/')
  }

  const payload = await getPayload({ config: configPromise })
  const { slug } = await params
  const sp = await searchParams

  const result = await payload.find({
    collection: 'services',
    depth: 1,
    draft: false,
    limit: 1,
    select: {
      name: true,
      slug: true,
      description: true,
      image: true,
      durationMinutes: true,
      enabledPriceInGBP: true,
      priceInGBP: true,
      active: true,
      linkedProduct: true,
    },
    where: {
      and: [
        { active: { equals: true } },
        {
          or: [
            { slug: { equals: slug } },
            { id: { equals: Number.isFinite(Number(slug)) ? Number(slug) : -1 } },
          ],
        },
      ],
    },
  })

  const service = result.docs[0]
  if (!service) notFound()

  const hasPrice =
    Boolean(service.enabledPriceInGBP) &&
    typeof service.priceInGBP === 'number' &&
    service.priceInGBP > 0

  const linkedProductId =
    typeof service.linkedProduct === 'object' && service.linkedProduct
      ? String(service.linkedProduct.id)
      : typeof service.linkedProduct === 'number'
        ? String(service.linkedProduct)
        : null

  const initialProductId = typeof sp.product === 'string' ? sp.product : linkedProductId

  return (
    <div className="container py-12 space-y-8">
      <Link className="inline-block text-sm underline underline-offset-2 hover:no-underline" href="/book">
        Back to all services
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden border bg-card">
            {service.image && typeof service.image === 'object' ? (
              <Media
                resource={service.image}
                className="relative aspect-[4/3]"
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/3] bg-muted" />
            )}
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-medium">{service.name}</h1>
            <p className="text-muted-foreground">
              {service.description || 'Book your preferred date and time for this service.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border px-2.5 py-1">{service.durationMinutes ?? 30} min</span>
              <span className="rounded-full border px-2.5 py-1">
                {hasPrice && typeof service.priceInGBP === 'number' ? (
                  <span>
                    <Price amount={service.priceInGBP} as="span" /> upfront
                  </span>
                ) : (
                  'Pay later / free'
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 md:p-8">
          <h2 className="text-xl font-medium mb-6">Book this service</h2>
          <BookingForm initialServiceSlugOrId={service.slug} initialProductId={initialProductId ?? null} />
        </div>
      </section>
    </div>
  )
}
