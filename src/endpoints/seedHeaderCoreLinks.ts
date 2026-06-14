import type { Endpoint } from 'payload'

import type { Header } from '@/payload-types'

const CORE_LINKS: Array<{ label: string; url: string }> = [
  { label: 'Shop', url: '/shop' },
  { label: 'Workshops', url: '/book' },
  { label: 'Account', url: '/account' },
]
const MAX_HEADER_NAV_ITEMS = 10

function normalizePath(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim().split('#')[0]?.split('?')[0] ?? ''
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return null
  if (trimmed === '/') return '/'
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const withoutTrailingSlash = withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash
  return withoutTrailingSlash.toLowerCase() || '/'
}

type HeaderNavItem = NonNullable<Header['navItems']>[number]

function navItemPath(item: HeaderNavItem): string | null {
  const link = item.link
  if (!link) return null
  if (link.type === 'custom') return normalizePath(link.url)
  if (
    link.type === 'reference' &&
    link.reference?.value &&
    typeof link.reference.value === 'object' &&
    'slug' in link.reference.value
  ) {
    const slug = link.reference.value.slug
    return typeof slug === 'string' ? normalizePath(`/${slug}`) : null
  }
  return null
}

function parseIncomingNavItems(input: unknown): HeaderNavItem[] | null {
  if (!Array.isArray(input)) return null
  return input as HeaderNavItem[]
}

export const seedHeaderCoreLinksEndpoint: Endpoint = {
  path: '/header/seed-core-links',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const header = (await req.payload.findGlobal({
      slug: 'header',
      depth: 0,
      req,
      overrideAccess: false,
      user: req.user,
    })) as Header

    let bodyNavItems: HeaderNavItem[] | null = null
    try {
      const body = (await req.json?.()) as { navItems?: unknown } | undefined
      bodyNavItems = parseIncomingNavItems(body?.navItems)
    } catch {
      bodyNavItems = null
    }

    const existing = bodyNavItems ?? header.navItems ?? []
    const usedPaths = new Set(
      existing
        .map((item) => navItemPath(item))
        .filter((pathValue): pathValue is string => Boolean(pathValue)),
    )

    const missingCoreLinks = CORE_LINKS.filter(({ url }) => !usedPaths.has(url.toLowerCase()))

    const missingItems = missingCoreLinks.map(({ label, url }) => ({
      link: { type: 'custom' as const, label, url, newTab: false },
    }))
    let nextNavItems = [...existing, ...missingItems]
    const corePaths = new Set(CORE_LINKS.map((item) => item.url.toLowerCase()))
    let trimmedCount = 0

    if (nextNavItems.length > MAX_HEADER_NAV_ITEMS) {
      for (let index = nextNavItems.length - 1; index >= 0 && nextNavItems.length > MAX_HEADER_NAV_ITEMS; index--) {
        const path = navItemPath(nextNavItems[index])
        if (!path || !corePaths.has(path)) {
          nextNavItems.splice(index, 1)
          trimmedCount++
        }
      }
    }

    if (nextNavItems.length > MAX_HEADER_NAV_ITEMS) {
      trimmedCount += nextNavItems.length - MAX_HEADER_NAV_ITEMS
      nextNavItems = nextNavItems.slice(0, MAX_HEADER_NAV_ITEMS)
    }

    const resultingPaths = new Set(
      nextNavItems.map((item) => navItemPath(item)).filter((pathValue): pathValue is string => Boolean(pathValue)),
    )
    const added = missingCoreLinks.filter(({ url }) => resultingPaths.has(url.toLowerCase())).length

    if (added === 0 && trimmedCount === 0) {
      return Response.json({ ok: true, added: 0, trimmed: 0, navItems: existing })
    }

    const updated = (await req.payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: nextNavItems,
      },
      depth: 0,
      req,
      overrideAccess: false,
      user: req.user,
    })) as Header

    return Response.json({
      ok: true,
      added,
      trimmed: trimmedCount,
      navItems: updated.navItems ?? [],
    })
  },
}
