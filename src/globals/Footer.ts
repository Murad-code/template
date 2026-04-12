import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    description:
      'Default footer links (Admin, Find my order, Book, Payload) come from PROJECT_TYPE in src/config/nav.ts. Add optional extras below.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Extra footer links (optional)',
      admin: {
        description: 'Appended after the derived links when the URL is not already listed.',
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
