import { RequiredDataFromCollectionSlug } from 'payload'

import { heading, paragraph, richText } from './home'

type ContactPageArgs = {
  contactFormId: number
}

export const contactPageData: (
  args: ContactPageArgs,
) => RequiredDataFromCollectionSlug<'pages'> = ({ contactFormId }) => {
  return {
    slug: 'contact',
    title: 'Contact',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText(
        heading('Contact us', 'h1'),
        paragraph(
          'Questions about coffee, workshops or orders? Send us a message and we will get back to you soon.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'formBlock',
        enableIntro: true,
        form: contactFormId,
        introContent: richText(
          heading('Send a message', 'h2'),
          paragraph('Fill in the form below and our team will respond as soon as possible.'),
        ),
      },
    ],
    meta: {
      title: 'Contact | Black Oak Coffee Co.',
      description:
        'Get in touch with Black Oak Coffee Co. about orders, workshops and general enquiries.',
    },
  }
}
