import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  interfaceName: 'ProductShowcaseBlock',
  labels: {
    plural: 'Product showcases',
    singular: 'Product showcase',
  },
  fields: [
    ...sectionHeaderFields,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Individual selection', value: 'selection' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 6,
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      relationTo: ['products'],
    },
    {
      name: 'enableViewAllLink',
      type: 'checkbox',
      defaultValue: true,
    },
    link({
      overrides: {
        admin: {
          condition: (_: unknown, { enableViewAllLink }: { enableViewAllLink?: boolean }) =>
            Boolean(enableViewAllLink),
        },
      },
    }),
  ],
}
