import type { Metadata } from 'next'
import { getSiteConfig } from '@/config/site'

const { siteName, companyName, serverURL } = getSiteConfig()
const brandName = companyName || siteName || 'Website'
const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: `${brandName} online platform.`,
  images: [
    {
      url: `${serverURL}/og-image.jpg`,
    },
  ],
  siteName: brandName,
  title: brandName,
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
