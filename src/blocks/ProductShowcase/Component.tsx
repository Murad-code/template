import React from 'react'

import { CarouselBlock } from '@/blocks/Carousel/Component'
import { CMSLink } from '@/components/Link'
import { ProductGridItem } from '@/components/ProductGridItem'
import { SectionHeader } from '@/components/SectionHeader'
import { fetchProductsForBlock } from '@/utilities/fetchProductsForBlock'
import type { ProductShowcaseBlock as ProductShowcaseBlockProps } from '@/payload-types'
import type { DefaultDocumentIDType } from 'payload'

export const ProductShowcaseBlock: React.FC<
  ProductShowcaseBlockProps & {
    id?: DefaultDocumentIDType
  }
> = async (props) => {
  const {
    align,
    categories,
    description,
    enableViewAllLink,
    eyebrow,
    layout,
    limit,
    link,
    populateBy,
    selectedDocs,
    title,
  } = props

  const products = await fetchProductsForBlock({
    categories,
    limit,
    populateBy,
    selectedDocs,
  })

  if (!products.length) return null

  return (
    <section className="container">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          align={align}
          className="mb-0"
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
        {enableViewAllLink && link && (
          <CMSLink {...link} appearance="outline" className="shrink-0" />
        )}
      </div>
      {layout === 'carousel' ? (
        <CarouselBlock
          blockType="carousel"
          categories={categories}
          id={props.id}
          limit={limit}
          populateBy={populateBy}
          selectedDocs={selectedDocs}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
