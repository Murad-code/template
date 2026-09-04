import { ProductGridItem } from '@/components/ProductGridItem'
import { cn } from '@/utilities/cn'
import React from 'react'

import type { Product } from '@/payload-types'

export type Props = {
  posts: Product[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((product, index) => {
          if (typeof product === 'object' && product !== null) {
            return <ProductGridItem key={product.id ?? index} product={product} />
          }

          return null
        })}
      </div>
    </div>
  )
}
