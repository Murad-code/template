import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const ServiceShowcase: Block = {
  slug: 'serviceShowcase',
  interfaceName: 'ServiceShowcaseBlock',
  labels: {
    plural: 'Service showcases',
    singular: 'Service showcase',
  },
  fields: [
    ...sectionHeaderFields,
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
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 3,
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      relationTo: ['services'],
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
