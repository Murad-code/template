import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { dateOnlyToUtcNoonDate, toDateOnlyString } from '@/utilities/dateOnly'

export const BookingSlots: CollectionConfig = {
  slug: 'booking-slots',
  admin: {
    useAsTitle: 'id',
    group: 'Booking',
    defaultColumns: ['id', 'service', 'slotDate', 'slotTime', 'capacity', 'active'],
    description:
      'Optional managed slots for a service and date. When rows exist for a date, only these times are offered (instead of generated grid).',
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'slotDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value == null || value === '') return value
            const ymd = toDateOnlyString(value as string | Date)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return value
            return dateOnlyToUtcNoonDate(ymd)
          },
        ],
        afterRead: [
          ({ value }) => {
            if (value == null || value === '') return value
            return toDateOnlyString(value as string | Date)
          },
        ],
      },
    },
    {
      name: 'slotTime',
      type: 'text',
      required: true,
      admin: { description: 'Start time HH:mm (24h).' },
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      admin: { description: 'Max concurrent bookings for this start time.' },
    },
    {
      name: 'staff',
      type: 'relationship',
      relationTo: 'admins',
      admin: { description: 'Optional staff member assigned to this slot.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
