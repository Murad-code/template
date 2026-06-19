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
      admin: {
        position: 'sidebar',
        description: 'Customer account (leave empty for guest bookings).',
      },
    },
    {
      name: 'guestEmail',
      label: 'Customer email',
      type: 'email',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Email used for booking confirmation and receipts.',
      },
    },
    {
      name: 'transactions',
      label: 'Transactions',
      type: 'relationship',
      relationTo: 'booking-transactions',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Stripe transaction rows for this booking.',
      },
    },
    {
      name: 'amount',
      type: 'number',
      admin: {
        readOnly: true,
        hidden: true,
        components: {
          Cell: '@/components/admin/BookingAmountCell#BookingAmountCell',
        },
      },
    },
    {
      name: 'amountDisplay',
      label: 'Amount',
      type: 'text',
      virtual: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        width: '50%',
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const amount = siblingData?.amount
            if (typeof amount !== 'number' || !Number.isFinite(amount)) return ''
            return `£${(amount / 100).toFixed(2)}`
          },
        ],
      },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'GBP',
      options: [{ label: 'British Pound (GBP)', value: 'GBP' }],
      admin: {
        position: 'sidebar',
        readOnly: true,
        width: '50%',
      },
    },
    {
      name: 'stripePaymentIntentId',
      label: 'Payment intent ID',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe PaymentIntent ID for this booking.',
        readOnly: true,
      },
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
      label: 'Download invoice',
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
        description: 'Refunded amount (stored in pence; displayed in pounds).',
        components: {
          Field: '@/components/RefundAmountField#RefundAmountField',
        },
      },
    },
    {
      name: 'refundAction',
      label: 'Refund booking',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/BookingRefundButton#BookingRefundButton',
        },
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
  ],
}
