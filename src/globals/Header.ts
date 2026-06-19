import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

const revalidateHeaderTag = () => {
  try {
    revalidateTag('global_header', 'max')
  } catch {
    // Ignore when running outside Next.js request/render context (e.g. CLI scripts).
  }
}

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    description:
      'Manage primary header navigation links for the frontend site. Add /shop, /book and /account to drive product, workshop/service and account journeys.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'headerNavHelp',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/HeaderNavHelp#HeaderNavHelp',
        },
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Header nav links',
      admin: {
        description: 'These links are rendered directly in the frontend header navigation.',
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 10,
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateHeaderTag()
      },
    ],
  },
}
