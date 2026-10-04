import type { Block } from 'payload'

export const MarqueeBlock: Block = {
  slug: 'marquee',
  interfaceName: 'MarqueeBlockType',
  labels: {
    plural: 'Marquee strips',
    singular: 'Marquee strip',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Phrases',
      labels: { plural: 'Phrases', singular: 'Phrase' },
      required: true,
      minRows: 3,
      admin: {
        description:
          'Short phrases that loop sideways. Three or more, otherwise the loop is visibly a loop.',
      },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
}
