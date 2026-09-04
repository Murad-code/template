import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { heroTypeOptions } from '@/heros/options'
import { linkGroup } from './linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: heroTypeOptions,
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'enableTrustRow',
      type: 'checkbox',
      label: 'Show trust row',
      defaultValue: false,
    },
    {
      name: 'trustItems',
      type: 'array',
      admin: {
        condition: (_, { enableTrustRow }) => Boolean(enableTrustRow),
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      label: 'Trust items',
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'landingSplit', 'landingSpotlight'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
