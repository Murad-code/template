import { RequiredDataFromCollectionSlug } from 'payload'

import { getSiteConfig } from '@/config/site'

export const contactFormData: () => RequiredDataFromCollectionSlug<'forms'> = () => {
  const { companyName, siteName } = getSiteConfig()
  const brandName = companyName || siteName || 'Site'
  const fromEmail =
    process.env.SMTP_FROM_EMAIL || `noreply@${brandName.toLowerCase().replace(/\s+/g, '')}.local`

  return {
    confirmationMessage: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Thanks — we have received your enquiry.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: `Someone from ${brandName} will get back to you as soon as possible.`,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    confirmationType: 'message',
    emails: [
      {
        emailFrom: `"${brandName}" \u003C${fromEmail}\u003E`,
        emailTo: '{{email}}',
        message: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: `Thank you for contacting ${brandName}. We have received your enquiry and will reply soon.`,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        subject: `We received your enquiry — ${brandName}`,
      },
    ],
    fields: [
      {
        name: 'name',
        blockName: 'name',
        blockType: 'text',
        label: 'Name',
        required: true,
        width: 50,
      },
      {
        name: 'email',
        blockName: 'email',
        blockType: 'email',
        label: 'Email',
        required: true,
        width: 50,
      },
      {
        name: 'phone',
        blockName: 'phone',
        blockType: 'text',
        label: 'Phone',
        required: true,
        width: 100,
      },
      {
        name: 'message',
        blockName: 'message',
        blockType: 'textarea',
        label: 'Message',
        required: true,
        width: 100,
      },
    ],
    submitButtonLabel: 'Send message',
    title: 'Contact Form',
  }
}
