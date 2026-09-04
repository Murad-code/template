import { RequiredDataFromCollectionSlug } from 'payload'

export const contactFormData: () => RequiredDataFromCollectionSlug<'forms'> = () => {
  const brandName = process.env.COMPANY_NAME || process.env.SITE_NAME || 'Site'
  const fromEmail = process.env.SMTP_FROM_EMAIL || `noreply@${brandName.toLowerCase().replace(/\s+/g, '')}.local`
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
                text: 'The contact form has been submitted successfully.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
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
                    text: 'Your contact form submission was successfully received.',
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
        subject: "You've received a new message.",
      },
    ],
    fields: [
      {
        name: 'name',
        blockName: 'name',
        blockType: 'text',
        label: 'Name',
        required: true,
        width: 100,
      },
      {
        name: 'email',
        blockName: 'email',
        blockType: 'email',
        label: 'Email',
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
