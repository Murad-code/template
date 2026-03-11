import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'marquee'
}

type MarqueeProductArgs = {
  title: string
  slug: string
  gallery: { image: Media }[]
  metaImage: Media
  category: Category
  priceInGBP: number
}

const defaultSiteName = process.env.SITE_NAME || 'Payload Commerce'

/**
 * Build product payload for a marquee (no variants). Used by seed for both ecommerce and booking modes.
 */
export function marqueeProductData({
  title,
  slug,
  gallery,
  metaImage,
  category,
  priceInGBP,
}: MarqueeProductArgs): RequiredDataFromCollectionSlug<'products'> {
  return {
    title,
    slug,
    _status: 'published',
    layout: [],
    categories: [category],
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: `Professional marquee hire. ${title}. Ideal for events, weddings, and outdoor occasions.`,
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    gallery,
    meta: {
      title: `${title} | ${defaultSiteName}`,
      image: metaImage,
      description: `Book or buy ${title}. Professional marquee hire.`,
    },
    priceInGBPEnabled: true,
    priceInGBP,
    relatedProducts: [],
  }
}
