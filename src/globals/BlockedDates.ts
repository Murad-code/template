import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const BlockedDates: GlobalConfig = {
  slug: 'blocked-dates',
  label: 'Blocked dates',
  admin: {
    description: 'Date ranges when the business is closed or bookings are disabled. Used to hide slots in booking flows.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'ranges',
      type: 'array',
      label: 'Blocked date ranges',
      admin: {
        description: 'Add ranges when you are closed or cannot take bookings.',
      },
      fields: [
        {
          name: 'start',
          type: 'date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'end',
          type: 'date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'reason',
          type: 'text',
          admin: {
            description: 'Optional label (e.g. "Bank holiday", "Closed for repairs").',
          },
        },
      ],
    },
  ],
}
