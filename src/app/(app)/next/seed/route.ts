import { createLocalReq, getPayload } from 'payload'
import { seed, type SeedHomeLayout } from '@/endpoints/seed'
import config from '@payload-config'
import { headers } from 'next/headers'

import { checkRole } from '@/access/utilities'

export const maxDuration = 300 // This function can run for a maximum of 300 seconds

function normalizeHomeLayout(layout: unknown): SeedHomeLayout {
  return layout === 'legacy' ? 'legacy' : 'showcase'
}

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !checkRole(['admin'], user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const homeLayout = normalizeHomeLayout(body.homeLayout)

    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq, mode: 'hybrid', homeLayout })

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
