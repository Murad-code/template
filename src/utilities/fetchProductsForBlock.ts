import configPromise from '@payload-config'
import type { Product } from '@/payload-types'
import { getPayload } from 'payload'

type FetchProductsArgs = {
  categories?: (number | { id: number })[] | null
  limit?: number | null
  populateBy?: 'collection' | 'selection' | null
  selectedDocs?: { value: Product | string | number }[] | null
}

export async function fetchProductsForBlock({
  categories,
  limit = 6,
  populateBy = 'collection',
  selectedDocs,
}: FetchProductsArgs): Promise<Product[]> {
  if (populateBy === 'selection' && selectedDocs?.length) {
    return selectedDocs
      .map((doc) => (typeof doc.value === 'object' ? doc.value : null))
      .filter(Boolean) as Product[]
  }

  const payload = await getPayload({ config: configPromise })
  const flattenedCategories = categories?.length
    ? categories.map((category) => (typeof category === 'object' ? category.id : category))
    : null

  const fetchedProducts = await payload.find({
    collection: 'products',
    depth: 1,
    limit: limit || 6,
    ...(flattenedCategories && flattenedCategories.length > 0
      ? {
          where: {
            categories: {
              in: flattenedCategories,
            },
          },
        }
      : {}),
  })

  return fetchedProducts.docs
}
