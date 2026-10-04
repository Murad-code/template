import type { Category, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Spec, SpecList } from '@/components/ui/spec-list'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product>
}

function firstCategoryTitle(categories: Product['categories']): string | null {
  const first = categories?.[0]
  if (first && typeof first === 'object') return (first as Category).title ?? null
  return null
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { categories, gallery, priceInGBP, title } = product

  let price = priceInGBP

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInGBP &&
      typeof variant.priceInGBP === 'number'
    ) {
      price = variant.priceInGBP
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  const category = firstCategoryTitle(categories)

  return (
    <Link
      className="group interactive-focus bg-card hover:bg-secondary relative flex h-full w-full flex-col overflow-hidden rounded-lg transition-colors"
      href={`/products/${product.slug}`}
    >
      {image ? (
        <Media
          className="bg-muted relative aspect-square overflow-hidden"
          imgClassName="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:scale-[1.03]"
          resource={image}
          size="(min-width: 1024px) 24rem, (min-width: 640px) 40vw, 90vw"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-2 p-4">
        {category ? (
          <SpecList>
            <Spec label="Category">{category}</Spec>
          </SpecList>
        ) : null}

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-body font-medium text-foreground">{title}</h3>

          {typeof price === 'number' && (
            <Price
              amount={price}
              as="span"
              className="text-body-sm tabular-figures shrink-0 text-foreground"
            />
          )}
        </div>
      </div>
    </Link>
  )
}
