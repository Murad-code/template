import { getSiteConfig } from '@/config/site'
import type { Header as HeaderGlobal } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

type NavItem = NonNullable<HeaderGlobal['navItems']>[number]

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

function navItemPath(item: NavItem): string | null {
  if (item.link.type === 'custom') return normalizePath(item.link.url)
  if (
    item.link.type === 'reference' &&
    item.link.reference?.value &&
    typeof item.link.reference.value === 'object' &&
    'slug' in item.link.reference.value
  ) {
    const slug = item.link.reference.value.slug
    return typeof slug === 'string' ? normalizePath(`/${slug}`) : null
  }
  return null
}

function dedupeNavItems(items: NavItem[]): NavItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key =
      navItemPath(item) ??
      `${item.link.type}:${(item.link.label ?? '').trim().toLowerCase()}:${item.id ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function Header() {
  const config = getSiteConfig()
  const header = await getCachedGlobal('header', 1)()
  const menu = dedupeNavItems(header.navItems ?? [])

  return <HeaderClient menu={menu} ecommerceEnabled={config.ecommerceEnabled} />
}
