import type { Footer, Header, Page } from '@/payload-types'

import type { SiteConfig } from '@/config/site'

type HeaderNavItem = NonNullable<Header['navItems']>[number]
type FooterNavItem = NonNullable<Footer['navItems']>[number]

/** Normalised path for internal custom links (e.g. `/shop`). External URLs return `null`. */
export function navItemPath(item: HeaderNavItem | FooterNavItem): string | null {
  const l = item.link
  if (!l) return null
  if (l.type === 'custom' && l.url) {
    const raw = l.url.trim()
    if (raw.startsWith('http://') || raw.startsWith('https://')) return null
    if (raw === '' || raw === '/') return '/'
    return raw.startsWith('/') ? raw : `/${raw}`
  }
  if (l.type === 'reference' && l.reference?.value && typeof l.reference.value === 'object') {
    const slug = (l.reference.value as Page).slug
    return slug ? `/${slug}` : null
  }
  return null
}

/** Stable key for deduping (internal path or full absolute URL). */
export function navItemKey(item: HeaderNavItem | FooterNavItem): string {
  const l = item.link
  if (l?.type === 'custom' && l.url) {
    const raw = l.url.trim()
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
    return navItemPath(item) ?? raw
  }
  const p = navItemPath(item)
  if (p) return p
  return `item:${item.id ?? 'unknown'}`
}

/** Core header links from PROJECT_TYPE (no CMS setup required). */
export function getDerivedHeaderNavItems(config: SiteConfig): HeaderNavItem[] {
  const items: HeaderNavItem[] = [
    {
      id: 'derived-nav-home',
      link: { type: 'custom', label: 'Home', url: '/', newTab: false },
    },
  ]
  if (config.ecommerceEnabled) {
    items.push({
      id: 'derived-nav-shop',
      link: { type: 'custom', label: 'Shop', url: '/shop', newTab: false },
    })
  }
  if (config.bookingEnabled) {
    items.push({
      id: 'derived-nav-book',
      link: { type: 'custom', label: 'Book', url: '/book', newTab: false },
    })
  }
  items.push({
    id: 'derived-nav-account',
    link: { type: 'custom', label: 'Account', url: '/account', newTab: false },
  })
  return items
}

/** Derived first; append CMS items whose path is not already covered. */
export function getEffectiveHeaderNavItems(header: Header, config: SiteConfig): HeaderNavItem[] {
  const derived = getDerivedHeaderNavItems(config)
  const used = new Set(derived.map(navItemKey))
  const extras = (header.navItems ?? []).filter((item) => !used.has(navItemKey(item)))
  return [...derived, ...extras]
}

/** Core footer links from PROJECT_TYPE. */
export function getDerivedFooterNavItems(config: SiteConfig): FooterNavItem[] {
  const items: FooterNavItem[] = [
    {
      id: 'derived-foot-admin',
      link: { type: 'custom', label: 'Admin', url: '/admin', newTab: false },
    },
  ]
  if (config.ecommerceEnabled) {
    items.push({
      id: 'derived-foot-find-order',
      link: { type: 'custom', label: 'Find my order', url: '/find-order', newTab: false },
    })
  }
  if (config.bookingEnabled) {
    items.push({
      id: 'derived-foot-book',
      link: { type: 'custom', label: 'Book', url: '/book', newTab: false },
    })
  }
  items.push({
    id: 'derived-foot-payload',
    link: {
      type: 'custom',
      label: 'Payload',
      url: 'https://payloadcms.com/',
      newTab: true,
    },
  })
  return items
}

export function getEffectiveFooterNavItems(footer: Footer, config: SiteConfig): FooterNavItem[] {
  const derived = getDerivedFooterNavItems(config)
  const used = new Set(derived.map(navItemKey))
  const extras = (footer.navItems ?? []).filter((item) => !used.has(navItemKey(item)))
  return [...derived, ...extras]
}
