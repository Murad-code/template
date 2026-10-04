import type { Block } from 'payload'
import { sectionStyleFields } from '@/fields/sectionStyle'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    ...sectionStyleFields,
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
