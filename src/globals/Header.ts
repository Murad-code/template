import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    description:
      'Core nav links are generated from PROJECT_TYPE (see src/config/nav.ts). Add optional extra links here; URLs that match the generated set are skipped on the site.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Extra nav links (optional)',
      admin: {
        description:
          'Optional links appended after Home / Shop / Book / Account. Use for pages like Contact or Pricing.',
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
