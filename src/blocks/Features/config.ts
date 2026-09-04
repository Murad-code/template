import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features grid',
    plural: 'Features grids',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section title',
    },
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
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Optional icon',
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
              condition: (_: unknown, { enableLink }: { enableLink?: boolean }) => Boolean(enableLink),
            },
          },
        }),
      ],
    },
  ],
}
