import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Bookings } from '@/collections/Bookings'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { BlockedDates } from '@/globals/BlockedDates'
import { BookingSettings } from '@/globals/BookingSettings'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// SendGrid: set SENDGRID_API_KEY (and SMTP_FROM_EMAIL) to use SendGrid SMTP. Otherwise use SMTP_* vars.
const sendgridApiKey = process.env.SENDGRID_API_KEY
const fromEmail = process.env.SMTP_FROM_EMAIL
const fromName = process.env.SMTP_FROM_NAME || process.env.SITE_NAME || 'Site'

const emailAdapter =
  fromEmail && (sendgridApiKey || process.env.SMTP_HOST)
    ? await nodemailerAdapter({
        defaultFromAddress: fromEmail,
        defaultFromName: fromName,
        transportOptions: sendgridApiKey
          ? {
              host: 'smtp.sendgrid.net',
              port: 587,
              secure: false,
              auth: { user: 'apikey', pass: sendgridApiKey },
            }
          : {
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT || '587', 10),
              secure: process.env.SMTP_SECURE === 'true',
              auth:
                process.env.SMTP_USER && process.env.SMTP_PASS
                  ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                  : undefined,
            },
        skipVerify: true,
      })
    : undefined

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
      // Link to the frontend products page in the admin sidebar.
      afterNavLinks: ['@/components/ViewProductsLink'],
    },
    user: Users.slug,
  },
  collections: [Users, Pages, Categories, Media, Bookings],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  email: emailAdapter,
  endpoints: [],
  globals: [Header, Footer, BlockedDates, BookingSettings],
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
