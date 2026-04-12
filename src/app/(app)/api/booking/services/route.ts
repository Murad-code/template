import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteConfig } from '@/config/site'

/**
 * GET /api/booking/services — active services for the public booking form.
 */
export async function GET(): Promise<Response> {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    return new Response(JSON.stringify({ error: 'Booking is disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    sort: 'name',
    limit: 100,
    depth: 0,
  })

  const body = docs.map((d) => {
    const doc = d as {
      id: number
      slug?: string | null
      name?: string
      durationMinutes?: number
      description?: string | null
      enabledPriceInGBP?: boolean | null
      priceInGBP?: number | null
    }
    return {
      id: doc.id,
      slug: doc.slug ?? undefined,
      name: doc.name,
      durationMinutes: doc.durationMinutes ?? 30,
      description: doc.description ?? undefined,
      priceInGBPEnabled: Boolean(doc.enabledPriceInGBP),
      priceInGBP: doc.priceInGBP ?? null,
    }
  })

  return Response.json(body)
}
