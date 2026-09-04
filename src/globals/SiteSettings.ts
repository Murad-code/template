import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

const revalidateSiteSettingsTag = () => {
  try {
    revalidateTag('global_site-settings', 'max')
  } catch {
    // Ignore when running outside Next.js request/render context (e.g. CLI scripts).
  }
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description:
      'Public contact details for the contact page, plus who receives enquiry emails. Outbound mail still uses SMTP_FROM_EMAIL as the From address.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateSiteSettingsTag()
      },
    ],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Public contact details',
      admin: {
        description: 'Shown on the contact page. Leave blank to fall back to COMPANY_EMAIL / COMPANY_PHONE / COMPANY_ADDRESS.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'publicEmail',
          type: 'email',
          label: 'Public email',
        },
        {
          name: 'publicPhone',
          type: 'text',
          label: 'Public phone',
        },
        {
          name: 'publicAddress',
          type: 'textarea',
          label: 'Public address',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Enquiry recipient',
      admin: {
        description:
          'Who receives contact-form notifications. This is the To address only; the sending identity remains SMTP_FROM_EMAIL.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'enquiryRecipientSource',
          type: 'select',
          defaultValue: 'customEmail',
          options: [
            { label: 'Custom email', value: 'customEmail' },
            { label: 'Admin user', value: 'adminUser' },
          ],
          admin: {
            description: 'Choose a specific inbox or an admin user account.',
          },
        },
        {
          name: 'enquiryEmail',
          type: 'email',
          label: 'Enquiry email',
          admin: {
            condition: (_, siblingData) => siblingData?.enquiryRecipientSource !== 'adminUser',
          },
          validate: (value, { data }) => {
            const source = (data as { enquiryRecipientSource?: string } | undefined)
              ?.enquiryRecipientSource
            if (source === 'adminUser') return true
            if (typeof value === 'string' && value.trim()) return true
            if (process.env.COMPANY_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL) {
              return true
            }
            return 'Enter an enquiry email, or switch the recipient to an admin user.'
          },
        },
        {
          name: 'enquiryAdminUser',
          type: 'relationship',
          relationTo: 'users',
          hasMany: false,
          filterOptions: () => ({
            roles: {
              contains: 'admin',
            },
          }),
          admin: {
            condition: (_, siblingData) => siblingData?.enquiryRecipientSource === 'adminUser',
            description: 'Enquiries are sent to this admin user’s login email.',
          },
          validate: (value, { data }) => {
            const source = (data as { enquiryRecipientSource?: string } | undefined)
              ?.enquiryRecipientSource
            if (source !== 'adminUser') return true
            if (value) return true
            return 'Select an admin user to receive enquiries.'
          },
        },
      ],
    },
  ],
}
