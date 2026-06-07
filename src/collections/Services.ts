import { amountField } from '@payloadcms/plugin-ecommerce'
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { ecommerceCurrenciesConfig } from '@/config/ecommerceCurrencies'

/** Sorts before `priceInGBP` so Drizzle/Postgres bind checkbox and amount to the correct columns. */
const gbpPriceEnabledFieldName = 'enabledPriceInGBP' as const

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'durationMinutes', 'priceInGBP', 'active'],
    group: 'Booking',
    description: 'Bookable services (e.g. Consultation, Session). Each booking is for one service.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Display name (e.g. "30 min Consultation").' },
    },
    slugField({
      fieldToUse: 'name',
      position: undefined,
    }),
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Optional short description shown when selecting a service.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Service image used on booking cards and the service details page.' },
    },
    {
      name: 'durationMinutes',
      type: 'number',
      required: true,
      defaultValue: 30,
      min: 5,
      max: 480,
      admin: { description: 'Length of the appointment in minutes. Used to generate time slots.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: gbpPriceEnabledFieldName,
          type: 'checkbox',
          label: 'Enable GBP price',
          defaultValue: false,
          admin: {
            style: { alignSelf: 'baseline', flex: '0 0 auto' },
            description: 'When enabled, customers pay this amount (minor units) at booking via Stripe.',
          },
        },
        amountField({
          currenciesConfig: ecommerceCurrenciesConfig,
          currency: ecommerceCurrenciesConfig.supportedCurrencies[0],
          overrides: {
            name: 'priceInGBP',
            admin: {
              condition: (_, siblingData) => Boolean(siblingData?.[gbpPriceEnabledFieldName]),
            },
            label: 'Price (GBP)',
          },
        }),
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Inactive services are hidden from the booking form.' },
    },
    {
      name: 'linkedProduct',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        description:
          'Hybrid shops: optional product tied to this service (booking confirmation can link commerce + booking).',
      },
    },
  ],
}
