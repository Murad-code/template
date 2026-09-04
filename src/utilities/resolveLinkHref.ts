import type { Page } from '@/payload-types'

type LinkLike = {
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | string | number
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export function resolveLinkHref(link?: LinkLike | null): string | null {
  if (!link) return null

  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value.slug) {
    return `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${link.reference.value.slug}`
  }

  return link.url || null
}
