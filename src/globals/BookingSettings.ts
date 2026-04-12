import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const BookingSettings: GlobalConfig = {
  slug: 'booking-settings',
  label: 'Booking settings',
  admin: {
    group: 'Booking',
    description:
      'Configure slot length and hours. Add **seven** weekday rows (Sun–Sat, weekday 0–6) to use per-day hours; otherwise defaults apply every day.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const ds = data?.defaultStartHour
        const de = data?.defaultEndHour
        if (typeof ds === 'number' && typeof de === 'number' && ds >= de) {
          throw new Error('Default start hour must be strictly before default end hour.')
        }
        const rows = data?.weekdayHours as
          | { weekday?: number | string; closed?: boolean; startHour?: number; endHour?: number }[]
          | undefined
        if (!Array.isArray(rows)) return data
        for (const row of rows) {
          if (row?.closed) continue
          const s = row?.startHour
          const e = row?.endHour
          if (typeof s === 'number' && typeof e === 'number' && s >= e) {
            throw new Error('Each open day needs start hour strictly before end hour.')
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'slotDurationMinutes',
      type: 'number',
      required: true,
      defaultValue: 30,
      admin: { description: 'Length of each bookable slot in minutes.' },
    },
    {
      name: 'defaultStartHour',
      type: 'number',
      required: true,
      defaultValue: 9,
      min: 0,
      max: 23,
      admin: {
        description:
          'Start hour (0–23) when **weekday hours** below is empty or has fewer than 7 rows. Ignored per day once a full week is configured.',
      },
    },
    {
      name: 'defaultEndHour',
      type: 'number',
      required: true,
      defaultValue: 17,
      min: 0,
      max: 23,
      admin: {
        description:
          'End hour (0–23) when **weekday hours** is incomplete. Must be greater than default start hour.',
      },
    },
    {
      name: 'weekdayHours',
      type: 'array',
      labels: { singular: 'Day', plural: 'Weekday hours (7 rows = per-day schedule)' },
      admin: {
        description:
          'Optional: add **exactly 7** rows (weekdays 0–6, 0 = Sunday) to set different hours or mark a day closed. Fewer than 7 rows are ignored; defaults above are used instead.',
      },
      fields: [
        {
          name: 'weekday',
          type: 'select',
          required: true,
          options: [
            { label: 'Sunday (0)', value: '0' },
            { label: 'Monday (1)', value: '1' },
            { label: 'Tuesday (2)', value: '2' },
            { label: 'Wednesday (3)', value: '3' },
            { label: 'Thursday (4)', value: '4' },
            { label: 'Friday (5)', value: '5' },
            { label: 'Saturday (6)', value: '6' },
          ],
          admin: { description: 'Matches UTC calendar day of the selected booking date.' },
        },
        {
          name: 'closed',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'No generated slots on this weekday.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'startHour',
              type: 'number',
              min: 0,
              max: 23,
              admin: {
                condition: (_, sibling) => !sibling?.closed,
                description: 'Start hour when open',
              },
            },
            {
              name: 'endHour',
              type: 'number',
              min: 0,
              max: 23,
              admin: {
                condition: (_, sibling) => !sibling?.closed,
                description: 'End hour when open (exclusive upper bound for slot grid)',
              },
            },
          ],
        },
      ],
    },
  ],
}
