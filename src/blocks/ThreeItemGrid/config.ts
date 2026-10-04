import type { Block } from 'payload'
import { sectionStyleFields } from '@/fields/sectionStyle'

export const ThreeItemGrid: Block = {
  slug: 'threeItemGrid',
  fields: [
    ...sectionStyleFields,
    {
      name: 'products',
      type: 'relationship',
      admin: {
        isSortable: true,
      },
      hasMany: true,
      label: 'Products to show',
      maxRows: 3,
      minRows: 3,
      relationTo: 'products',
    },
  ],
  interfaceName: 'ThreeItemGridBlock',
  labels: {
    plural: 'Three Item Grids',
    singular: 'Three Item Grid',
  },
}
