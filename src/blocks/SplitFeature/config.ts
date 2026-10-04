import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'
import { sectionStyleFields } from '@/fields/sectionStyle'

export const SplitFeature: Block = {
  slug: 'splitFeature',
  interfaceName: 'SplitFeatureBlock',
  labels: {
    plural: 'Split features',
    singular: 'Split feature / brand story',
  },
  fields: [
    ...sectionStyleFields,
    ...sectionHeaderFields,
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'points',
      type: 'array',
      label: 'Checklist',
      labels: { plural: 'Points', singular: 'Point' },
      admin: {
        description: 'Short ticked points under the text. Leave empty to omit.',
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'kenBurns',
      type: 'checkbox',
      defaultValue: false,
      label: 'Slowly drift the image',
      admin: {
        description:
          'A very slow zoom that stops a large still from feeling like a screenshot. Ignored for visitors who have asked for reduced motion.',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Image right', value: 'right' },
        { label: 'Image left', value: 'left' },
      ],
    },
    {
      name: 'enableLink',
      type: 'checkbox',
    },
    link({
      overrides: {
        admin: {
          condition: (_: unknown, { enableLink }: { enableLink?: boolean }) => Boolean(enableLink),
        },
      },
    }),
  ],
}
