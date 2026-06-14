import { createLocalReq, getPayload } from 'payload'
import { seed, type SeedMode } from '@/endpoints/seed'
import config from '@payload-config'
import { headers } from 'next/headers'

import { getSiteConfig } from '@/config/site'
import { checkRole } from '@/access/utilities'

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

function normalizeMode(mode: unknown): SeedMode {
  if (mode === 'ecommerce' || mode === 'booking' || mode === 'hybrid') return mode
  const { projectType } = getSiteConfig()
  if (projectType === 'booking' || projectType === 'hybrid') return projectType
  return 'ecommerce'
}

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !checkRole(['root'], user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const mode = normalizeMode(body.mode)

    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq, mode })

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
