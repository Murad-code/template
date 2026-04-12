import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { dateOnlyToUtcNoonDate, toDateOnlyString } from '@/utilities/dateOnly'
import { checkRole } from '@/access/utilities'
import { notifyWaitlistOnCancel } from '@/collections/Bookings/hooks/notifyWaitlistOnCancel'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  hooks: {
    afterChange: [notifyWaitlistOnCancel],
  },
  admin: {
    useAsTitle: 'id',
    group: 'Booking',
    defaultColumns: [
      'id',
      'service',
      'slotDate',
      'slotTime',
      'guestEmail',
      'status',
      'amount',
      'createdAt',
    ],
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
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      admin: { description: 'The bookable service (e.g. Consultation, Session).' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { position: 'sidebar', description: 'Optional: link to a product when using hybrid ecommerce + booking.' },
    },
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
      admin: { description: 'Time slot (e.g. "09:00").' },
    },
    {
      name: 'slotOffering',
      type: 'relationship',
      relationTo: 'booking-slots',
      admin: {
        position: 'sidebar',
        description: 'Set when the customer books a managed slot row (capacity-tracked).',
      },
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
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'downloadBookingInvoice',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/BookingDownloadInvoiceButton#BookingDownloadInvoiceButton',
        },
      },
    },
    {
      name: 'refundedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Set when a refund is issued via Stripe from this screen.',
      },
    },
    {
      name: 'refundAmount',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Refunded amount in pence.',
        components: {
          Field: '@/components/RefundAmountField#RefundAmountField',
        },
      },
    },
    {
      name: 'refundAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/BookingRefundButton#BookingRefundButton',
        },
      },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Set when the customer paid at booking time (pay on book).',
        readOnly: true,
      },
    },
    {
      name: 'amount',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Total charged (minor units / pence). Set when payment succeeds.',
        readOnly: true,
      },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'GBP',
      options: [{ label: 'GBP', value: 'GBP' }],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Secret token for guest “view booking” links (with email).',
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' || !value) {
              return crypto.randomUUID()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'transactions',
      type: 'relationship',
      relationTo: 'booking-transactions',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Payment transaction rows for this booking.',
      },
    },
  ],
}
