import type { Block } from 'payload'

import { sectionHeaderFields } from '@/fields/sectionHeader'

export const LogoCloud: Block = {
  slug: 'logoCloud',
  interfaceName: 'LogoCloudBlock',
  labels: {
    plural: 'Logo clouds',
    singular: 'Logo cloud',
  },
  fields: [
    ...sectionHeaderFields,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Marquee', value: 'marquee' },
      ],
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Used when no image is provided.',
          },
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
