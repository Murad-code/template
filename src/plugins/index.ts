import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'

import { ecommerceCurrenciesConfig } from '@/config/ecommerceCurrencies'

import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Page, Product } from '@/payload-types'
import { getSiteConfig } from '@/config/site'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { sendOrderConfirmationEmail } from '@/utilities/sendOrderConfirmationEmail'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  const { siteName } = getSiteConfig()
  return doc?.title ? `${doc.title} | ${siteName}` : siteName
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    currencies: ecommerceCurrenciesConfig,
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        hooks: {
          ...defaultCollection.hooks,
          afterRead: [
            ...(defaultCollection.hooks?.afterRead ?? []),
            async ({ doc, req }) => {
              if (doc.customerEmail) return doc
              const customer = doc.customer
              if (typeof customer === 'object' && customer !== null && 'email' in customer && customer.email) {
                doc.customerEmail = customer.email as string
                return doc
              }
              if (typeof customer === 'number') {
                try {
                  const user = await req.payload.findByID({
                    collection: 'users',
                    id: customer,
                    depth: 0,
                    req,
                    overrideAccess: false,
                  })
                  if (user?.email) {
                    doc.customerEmail = user.email
                  }
                } catch {
                  // ignore lookup errors
                }
              }
              return doc
            },
          ],
          beforeChange: [
            ...(defaultCollection.hooks?.beforeChange ?? []),
            async ({ data, req }) => {
              const customerId =
                typeof data.customer === 'number'
                  ? data.customer
                  : typeof data.customer === 'object' && data.customer !== null && typeof (data.customer as { id?: number }).id === 'number'
                    ? (data.customer as { id: number }).id
                    : null
              if (!customerId || (data.customerEmail != null && data.customerEmail !== '')) return data
              try {
                const user = await req.payload.findByID({
                  collection: 'users',
                  id: customerId,
                  depth: 0,
                  req,
                  overrideAccess: false,
                })
                if (user?.email) {
                  data.customerEmail = user.email
                }
              } catch {
                // ignore lookup errors
              }
              return data
            },
          ],
          afterChange: [
            ...(defaultCollection.hooks?.afterChange ?? []),
            async ({ doc, operation, req }) => {
              req.payload.logger.info({
                msg: 'Orders afterChange hook called',
                operation,
                orderId: doc?.id,
                hasCustomerEmail: Boolean(doc?.customerEmail),
                hasCustomer: Boolean(doc?.customer),
              })
              // Only send confirmation on order create; recipient email is resolved in sendOrderConfirmationEmail
              // (from customerEmail for guests, or from populated customer.email for logged-in users)
              if (operation !== 'create' || !doc?.id) return
              try {
                const order = await req.payload.findByID({
                  collection: 'orders',
                  id: doc.id,
                  depth: 2, // needed so order.customer is populated with user email for logged-in customers
                  req,
                })
                if (order) {
                  req.payload.logger.info({ msg: 'Sending order confirmation email', orderId: order.id })
                  await sendOrderConfirmationEmail({ order, req })
                }
              } catch (err) {
                req.payload.logger.error({ msg: 'Failed to send order confirmation email', err })
              }
            },
          ],
        },
        fields: [
          ...defaultCollection.fields,
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
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
            name: 'downloadInvoice',
            type: 'ui',
            admin: {
              position: 'sidebar',
              description: 'Download the order invoice as a PDF (UK Gov compliant).',
              label: 'Download invoice',
              components: {
                Field: '@/components/OrderDownloadInvoiceButton#OrderDownloadInvoiceButton',
              },
            },
          },
          {
            name: 'refundedAt',
            type: 'date',
            admin: {
              position: 'sidebar',
              readOnly: true,
              description: 'Set when order is refunded via Stripe.',
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
            type: 'ui',
            admin: {
              position: 'sidebar',
              description:
                'Issue a refund via Stripe. Refunded At and Refund Amount are set automatically after a successful refund.',
              label: 'Refund order',
              components: {
                Field: '@/components/OrderRefundButton#OrderRefundButton',
              },
            },
          },
        ],
      }),
    },
    payments: {
      paymentMethods: [
        stripeAdapter({
          secretKey: process.env.STRIPE_SECRET_KEY!,
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
  }),
]
