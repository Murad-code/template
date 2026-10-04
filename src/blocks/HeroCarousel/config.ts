import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const HeroCarousel: Block = {
  slug: 'heroCarousel',
  interfaceName: 'HeroCarouselBlock',
  labels: {
    plural: 'Hero banners',
    singular: 'Hero banner / carousel',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Banner',
      labels: { plural: 'Slides', singular: 'Slide' },
      required: true,
      minRows: 1,
      admin: {
        description: 'One slide renders as a still hero. Two or more rotate.',
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background photo',
        },
        linkGroup({
          appearances: ['default', 'outline'],
          overrides: { maxRows: 2 },
        }),
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      label: 'Rotate automatically',
      admin: {
        description:
          'Rotation always stops on hover, on focus, and for visitors who have asked for reduced motion. A pause control is shown either way.',
      },
    },
    {
      name: 'minHeight',
      type: 'select',
      defaultValue: 'tall',
      label: 'Height',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Tall', value: 'tall' },
        { label: 'Full screen', value: 'full' },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlight cards',
      maxRows: 4,
      admin: {
        description: 'Optional cards sitting below the banner copy.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}
