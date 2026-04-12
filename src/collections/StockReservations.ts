import type { CollectionConfig } from 'payload'

/**
 * Ephemeral rows: quantity reserved while items sit in active carts (TTL).
 * Written only from cart hooks with overrideAccess; no public REST use.
 */
export const StockReservations: CollectionConfig = {
  slug: 'stock-reservations',
  labels: { singular: 'Stock reservation', plural: 'Stock reservations' },
  admin: {
    hidden: true,
    defaultColumns: ['cart', 'product', 'variant', 'quantity', 'expiresAt'],
  },
  access: {
    create: () => false,
    read: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'cart',
      type: 'relationship',
      relationTo: 'carts',
      required: true,
      index: true,
    },
    {
      name: 'cartItemId',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Payload cart line array row id' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'variants',
      required: false,
      index: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true,
    },
  ],
}
