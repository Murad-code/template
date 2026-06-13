import type { Product, Variant } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInGBP, title } = product

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

  return (
    <Link
      className="group relative inline-block h-full w-full overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/10 transition-shadow hover:shadow-md hover:shadow-black/15 dark:shadow-black/40 dark:hover:shadow-black/50"
      href={`/products/${product.slug}`}
    >
      {image ? (
        <Media
          className={clsx(
            'relative aspect-square overflow-hidden bg-muted',
          )}
          height={80}
          imgClassName={clsx('h-full w-full object-cover', {
            'transition duration-300 ease-in-out group-hover:scale-102': true,
          })}
          resource={image}
          width={80}
        />
      ) : null}

      <div className="flex items-center justify-between gap-3 p-4 text-muted-foreground group-hover:text-foreground">
        <div className="leading-tight">{title}</div>

        {typeof price === 'number' && (
          <div className="leading-tight">
            <Price amount={price} as="span" />
          </div>
        )}
      </div>
    </Link>
  )
}
