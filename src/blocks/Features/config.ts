import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { iconField } from '@/fields/icon'
import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'
import { sectionStyleFields } from '@/fields/sectionStyle'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features grid',
    plural: 'Features grids',
  },
  fields: [
    ...sectionStyleFields,
    ...sectionHeaderFields,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Linked cards', value: 'linkedCards' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        iconField({ label: 'Icon' }),
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon image',
          admin: {
            description: 'Overrides the icon above. Use for a logo or a custom mark.',
          },
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
            ],
          }),
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Enable link',
        },
        link({
          overrides: {
            admin: {
              condition: (_: unknown, { enableLink }: { enableLink?: boolean }) =>
                Boolean(enableLink),
            },
          },
        }),
      ],
    },
  ],
}
