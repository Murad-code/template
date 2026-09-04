import type { Block } from 'payload'

import { sectionHeaderFields } from '@/fields/sectionHeader'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    plural: 'Stats sections',
    singular: 'Stats / trust bar',
  },
  fields: [
    ...sectionHeaderFields,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'bar',
      options: [
        { label: 'Trust bar', value: 'bar' },
        { label: 'Cards', value: 'cards' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
