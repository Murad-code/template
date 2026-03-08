import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const BookingSettings: GlobalConfig = {
  slug: 'booking-settings',
  label: 'Booking settings',
  admin: {
    description: 'Configure availability and slot duration. Used when booking is enabled (ENABLE_BOOKING or PROJECT_TYPE=booking|hybrid).',
  },
  access: {
    read: () => true,
    update: adminOnly,
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
      admin: { description: 'Start hour (0–23) for generating slots.' },
    },
    {
      name: 'defaultEndHour',
      type: 'number',
      required: true,
      defaultValue: 17,
      min: 0,
      max: 23,
      admin: { description: 'End hour (0–23) for generating slots.' },
    },
  ],
}
