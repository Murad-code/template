import type { Block } from 'payload'

import { iconField } from '@/fields/icon'
import { sectionHeaderFields } from '@/fields/sectionHeader'
import { sectionStyleFields } from '@/fields/sectionStyle'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    plural: 'Stats sections',
    singular: 'Stats / trust bar',
  },
  fields: [
    ...sectionStyleFields,
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
      name: 'countUp',
      type: 'checkbox',
      defaultValue: false,
      label: 'Count the figures up',
      admin: {
        description:
          'Counts from zero when the figures scroll into view. Values without a single number, such as 24/7, are left alone. Ignored for visitors who have asked for reduced motion.',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        iconField({ label: 'Icon' }),
      ],
    },
  ],
}
