import { RequiredDataFromCollectionSlug } from 'payload'

import { getSiteConfig } from '@/config/site'

import { heading, paragraph, richText } from './home'

type ContactPageArgs = {
  contactFormId: number | string
}

export const contactPageData: (
  args: ContactPageArgs,
) => RequiredDataFromCollectionSlug<'pages'> = ({ contactFormId }) => {
  const { siteName } = getSiteConfig()
  const brand = siteName || 'us'

  return {
    slug: 'contact',
    title: 'Contact',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText(
        heading('Contact us', 'h1'),
        paragraph(
          `Questions about ${brand}, orders or bookings? Send an enquiry and we will get back to you soon.`,
        ),
      ),
    },
    layout: [
      {
        blockType: 'formBlock',
        enableIntro: true,
        showSiteContactDetails: true,
        form: contactFormId as number,
        introContent: richText(
          heading('Send a message', 'h2'),
          paragraph('Fill in the form below with your name, email, phone and message.'),
        ),
      },
    ],
    meta: {
      title: `Contact | ${brand}`,
      description: `Get in touch with ${brand} about orders, bookings and general enquiries.`,
    },
  }
}
