import { LineItemRow } from '@/components/LineItemRow'
import { Price } from '@/components/Price'
import { Product, Variant } from '@/payload-types'
import { resolveProductVariantDisplay } from '@/utilities/resolveProductVariantDisplay'

type Props = {
  product: Product
  style?: 'compact' | 'default'
  variant?: Variant
  quantity?: number
  /**
   * Force all formatting to a particular currency.
   */
  currencyCode?: string
}

export const ProductItem: React.FC<Props> = ({
  product,
  style = 'default',
  quantity,
  variant,
  currencyCode,
}) => {
  const { title } = product
  const { image, price: itemPrice, variantLabel } = resolveProductVariantDisplay({ product, variant })
  const itemURL = `/products/${product.slug}${variant ? `?variant=${variant.id}` : ''}`

  return (
    <LineItemRow
      href={itemURL}
      imageAlt={image?.alt || title}
      imageUrl={image?.url || undefined}
      quantity={quantity}
      title={title}
      trailing={
        itemPrice && quantity ? (
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
            <Price
              amount={itemPrice * quantity}
              className="text-sm font-mono text-muted-foreground"
              currencyCode={currencyCode}
            />
          </div>
        ) : null
      }
      variantLabel={variantLabel}
    />
  )
}
