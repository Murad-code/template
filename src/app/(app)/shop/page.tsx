import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category } = await searchParams
  const payload = await getPayload({ config: configPromise })
  const normalizedSort = typeof sort === 'string' ? sort : undefined
  const normalizedCategory = typeof category === 'string' ? category : undefined
  const clearSearchParams = new URLSearchParams()

  if (normalizedSort) {
    clearSearchParams.set('sort', normalizedSort)
  }

  if (normalizedCategory) {
    clearSearchParams.set('category', normalizedCategory)
  }

  const clearSearchHref = clearSearchParams.toString()
    ? `/shop?${clearSearchParams.toString()}`
    : '/shop'

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInGBP: true,
    },
    ...(normalizedSort ? { sort: normalizedSort } : { sort: 'title' }),
    ...(searchValue || category
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(searchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: searchValue,
                          },
                        },
                        {
                          slug: {
                            like: searchValue,
                          },
                        },
                      ],
                    },
                  ]
                : []),
              ...(normalizedCategory
                ? [
                    {
                      categories: {
                        contains: normalizedCategory,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <div className="text-body-sm text-muted-foreground mb-8 flex flex-wrap items-center gap-3">
          <p>
            {products.docs?.length === 0
              ? 'There are no products that match '
              : `Showing ${products.docs.length} ${resultsText} for `}
            <span className="text-foreground font-medium">&quot;{searchValue}&quot;</span>
          </p>
          <Link
            className="decoration-border-strong hover:decoration-current text-foreground underline underline-offset-4"
            href={clearSearchHref}
          >
            Clear search
          </Link>
        </div>
      ) : null}

      {!searchValue && products.docs?.length === 0 && (
        <p className="text-body-lg text-muted-foreground">No products match these filters.</p>
      )}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.docs.map((product) => {
            return <ProductGridItem key={product.id} product={product} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
