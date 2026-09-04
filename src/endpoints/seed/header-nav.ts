import type { Header } from '@/payload-types'

type SeedMode = 'ecommerce' | 'booking' | 'hybrid'

function customHeaderNavItem(
  label: string,
  url: string,
): NonNullable<Header['navItems']>[number] {
  return {
    link: { type: 'custom', label, url, newTab: false },
  }
}

export function buildHeaderNavItems(mode: SeedMode): NonNullable<Header['navItems']> {
  const shouldSeedEcommerce = mode === 'ecommerce' || mode === 'hybrid'
  const shouldSeedBooking = mode === 'booking' || mode === 'hybrid'

  return [
    customHeaderNavItem('About', '/about'),
    ...(shouldSeedEcommerce ? [customHeaderNavItem('Shop', '/shop')] : []),
    ...(shouldSeedBooking ? [customHeaderNavItem('Workshops', '/book')] : []),
    customHeaderNavItem('Account', '/account'),
    customHeaderNavItem('Blog', '/blog'),
    customHeaderNavItem('Contact', '/contact'),
  ]
}
