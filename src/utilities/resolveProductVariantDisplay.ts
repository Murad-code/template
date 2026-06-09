import type { Media, Product, Variant, VariantOption } from '@/payload-types'

type ProductGalleryRow = NonNullable<Product['gallery']>[number]

type DisplayOptions = {
  product: Product
  variant?: Variant
}

type DisplayResult = {
  image?: Media
  isVariant: boolean
  price?: number
  variantLabel?: string
}

export function resolveProductVariantDisplay({ product, variant }: DisplayOptions): DisplayResult {
  const metaImage =
    product.meta?.image && typeof product.meta.image === 'object' ? product.meta.image : undefined
  const firstGalleryImage =
    typeof product.gallery?.[0]?.image === 'object' ? product.gallery[0].image : undefined

  let image = firstGalleryImage || metaImage
  const isVariant = Boolean(variant)
  let price = product.priceInGBP ?? undefined

  if (variant) {
    price = variant.priceInGBP ?? undefined

    const imageVariant = product.gallery?.find((galleryRow: ProductGalleryRow) => {
      if (!galleryRow.variantOption) return false
      const variantOptionID =
        typeof galleryRow.variantOption === 'object'
          ? galleryRow.variantOption.id
          : galleryRow.variantOption

      return variant.options?.some((option: number | VariantOption) =>
        typeof option === 'object' ? option.id === variantOptionID : option === variantOptionID,
      )
    })

    if (imageVariant && typeof imageVariant.image === 'object') {
      image = imageVariant.image
    }
  }

  const variantLabel = variant?.options
    ?.map((option: number | VariantOption) => (typeof option === 'object' ? option.label : null))
    .filter(Boolean)
    .join(', ')

  return {
    image,
    isVariant,
    price,
    variantLabel: variantLabel || undefined,
  }
}
