import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

import { lowStockVariantAfterChange } from '@/collections/Products/lowStockHooks'

export const VariantsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  hooks: {
    ...defaultCollection.hooks,
    afterChange: [...(defaultCollection.hooks?.afterChange ?? []), lowStockVariantAfterChange],
  },
})
