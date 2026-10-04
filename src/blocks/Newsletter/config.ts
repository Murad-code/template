import type { Block } from 'payload'

import { sectionHeaderFields } from '@/fields/sectionHeader'
import { sectionStyleFields } from '@/fields/sectionStyle'

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: {
    plural: 'Newsletter sections',
    singular: 'Newsletter signup',
  },
  fields: [
    ...sectionStyleFields,
    ...sectionHeaderFields,
    {
      name: 'placeholder',
      type: 'text',
      defaultValue: 'you@example.com',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thanks for subscribing.',
    },
    {
      name: 'privacyNote',
      type: 'text',
      defaultValue: 'No spam. Unsubscribe any time.',
    },
  ],
}
