import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { toDateOnlyString } from '@/utilities/dateOnly'

export const BlockedDates: GlobalConfig = {
  slug: 'blocked-dates',
  label: 'Blocked dates',
  admin: {
    group: 'Booking',
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
          hooks: {
            beforeValidate: [
              ({ value }) => {
                if (value == null || value === '') return value
                return toDateOnlyString(String(value))
              },
            ],
            afterRead: [
              ({ value }) => {
                if (value == null || value === '') return value
                return toDateOnlyString(String(value))
              },
            ],
          },
        },
        {
          name: 'end',
          type: 'date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
          hooks: {
            beforeValidate: [
              ({ value }) => {
                if (value == null || value === '') return value
                return toDateOnlyString(String(value))
              },
            ],
            afterRead: [
              ({ value }) => {
                if (value == null || value === '') return value
                return toDateOnlyString(String(value))
              },
            ],
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
