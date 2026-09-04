import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a cached loader for globals. Skips Next.js cache in development so
 * CLI seeds (header nav, etc.) are visible without restarting the dev server.
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) => {
  const loader = async () => getGlobal<T>(slug, depth)

  if (process.env.NODE_ENV === 'development') {
    return loader
  }

  return unstable_cache(loader, [slug, String(depth)], {
    tags: [`global_${slug}`],
  })
}
