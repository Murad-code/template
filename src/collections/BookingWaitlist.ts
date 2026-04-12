import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { dateOnlyToUtcNoonDate, toDateOnlyString } from '@/utilities/dateOnly'

export const BookingWaitlist: CollectionConfig = {
  slug: 'booking-waitlist',
  admin: {
    useAsTitle: 'guestEmail',
    group: 'Booking',
    defaultColumns: ['guestEmail', 'service', 'slotDate', 'slotTime', 'status', 'createdAt'],
    description: 'Waitlist signups when a managed slot is full.',
  },
  access: {
    create: () => true,
    read: adminOnly,
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
      admin: {
        description:
          'Preferred start time (HH:mm), or leave empty for “any time that day”. Required when joining a specific managed slot.',
      },
    },
    {
      name: 'slotOffering',
      type: 'relationship',
      relationTo: 'booking-slots',
      admin: { description: 'Managed slot row, if applicable.' },
    },
    {
      name: 'guestEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'guestName',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Notified', value: 'notified' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
}
