'use client'
import type { Category, Product, Variant } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import React, { Suspense } from 'react'
import Link from 'next/link'

import { VariantSelector } from './VariantSelector'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { StockIndicator } from '@/components/product/StockIndicator'
import { Button } from '@/components/ui/button'
import { Spec, SpecList } from '@/components/ui/spec-list'

export function ProductDescription({
  product,
  bookScheduleHref = null,
}: {
  product: Product
  bookScheduleHref?: string | null
}) {
  const { currency } = useCurrency()
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  const firstCategory = product.categories?.[0]
  const categoryTitle =
    firstCategory && typeof firstCategory === 'object'
      ? ((firstCategory as Category).title ?? null)
      : null

  if (hasVariants) {
    const priceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        {categoryTitle ? (
          <SpecList>
            <Spec label="Category">{categoryTitle}</Spec>
          </SpecList>
        ) : null}
        <h1 className="text-h1">{product.title}</h1>
        {/* The price is a specification, so it is set in the same mono voice
            as every other figure on the site rather than as a coloured badge. */}
        <div className="text-h3 tabular-figures">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <Price amount={amount} />
          )}
        </div>
      </div>
      {product.description ? (
        <RichText className="max-w-prose" data={product.description} enableGutter={false} />
      ) : null}
      <hr className="border-border" />
      {hasVariants && (
        <>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>

          <hr className="border-border" />
        </>
      )}
      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
        {bookScheduleHref ? (
          <Button asChild variant="outline" type="button">
            <Link href={bookScheduleHref}>Book / Schedule</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
