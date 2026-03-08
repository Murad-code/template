import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { checkRole } from '@/access/utilities'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'slotDate', 'slotTime', 'guestEmail', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (req.user && checkRole(['admin'], req.user)) return true
      if (req.user?.id) return { customer: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => {
      if (req.user && checkRole(['admin'], req.user)) return true
      if (req.user?.id) return { customer: { equals: req.user.id } }
      return false
    },
    delete: adminOnly,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Leave empty for guest bookings.' },
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
      name: 'slotDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'slotTime',
      type: 'text',
      required: true,
      admin: { description: 'Time slot (e.g. "09:00").' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
