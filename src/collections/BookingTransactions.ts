import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const BookingTransactions: CollectionConfig = {
  slug: 'booking-transactions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'booking', 'status', 'amount', 'currency', 'createdAt'],
    group: 'Booking',
    description: 'Payment records for paid bookings (Stripe).',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      admin: { description: 'The booking this payment belongs to.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      admin: { description: 'Amount in minor units (pence for GBP).' },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'GBP',
      options: [{ label: 'GBP', value: 'GBP' }],
    },
    {
      name: 'customerEmail',
      type: 'email',
      admin: { description: 'Guest or payer email (for admin reference).' },
    },
    {
      name: 'stripe',
      type: 'group',
      fields: [
        {
          name: 'paymentIntentID',
          type: 'text',
          admin: { description: 'Stripe PaymentIntent ID.' },
        },
      ],
    },
  ],
}
