import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

const defaultSiteName = process.env.SITE_NAME || 'Black Oak Coffee Co.'

function textNode(text: string): any {
  return { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }
}

function paragraph(text: string): any {
  return {
    type: 'paragraph',
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function heading(text: string, tag: 'h1' | 'h2' | 'h3' = 'h2'): any {
  return {
    type: 'heading',
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    version: 1,
  }
}

function richText(...children: any[]): any {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

type LegacyHomeArgs = {
  metaImage: Media
  contentImage: Media
}

/** Previous homepage layout (lowImpact hero + content/features/media/cta/faq). Kept for rollback. */
export const legacyHomePageData: (args: LegacyHomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
  contentImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Shop Coffee',
            url: '/shop',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Book a Workshop',
            url: '/book',
          },
        },
      ],
      richText: richText(
        heading('Coffee Worth Slowing Down For', 'h1'),
        paragraph(
          'Small-batch specialty coffee, brewing equipment and hands-on workshops designed to help you enjoy better coffee at home.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: richText(
              heading('Small-batch roasted coffee for everyday rituals.', 'h2'),
              paragraph(
                'Black Oak Coffee Co. sources exceptional coffees, roasts in small batches and helps customers brew better through practical workshops and guides.',
              ),
            ),
          },
        ],
      },
      {
        blockType: 'features',
        title: 'Featured Categories',
        items: [
          { title: 'Single Origin Coffee', description: richText(paragraph('Distinct origin character with seasonal rotation.')) },
          { title: 'Espresso Blends', description: richText(paragraph('Balanced blends for home espresso and milk drinks.')) },
          { title: 'Brewing Equipment', description: richText(paragraph('Tools to improve consistency and extraction at home.')) },
          { title: 'Gift Sets', description: richText(paragraph('Curated bundles ideal for gifting and first-time exploration.')) },
          { title: 'Coffee Subscriptions', description: richText(paragraph('Recurring monthly deliveries tailored to brew preferences.')) },
        ],
      },
      {
        blockType: 'mediaBlock',
        media: contentImage,
      },
      {
        blockType: 'cta',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Book a Session',
              url: '/book',
            },
          },
        ],
        richText: richText(
          heading('Learn From Our Roasters', 'h3'),
          paragraph(
            'Join tastings and practical workshops covering brew fundamentals, espresso setup, milk texturing and sensory skills.',
          ),
        ),
      },
      {
        blockType: 'faq',
        title: 'Frequently Asked Questions',
        items: [
          {
            question: 'Can I book workshops as a group?',
            answer: richText(paragraph('Yes. Corporate workshops and private group sessions can be arranged on request.')),
          },
          {
            question: 'Do subscriptions renew automatically?',
            answer: richText(paragraph('Yes, subscriptions are recurring monthly and can be adjusted or cancelled in your account.')),
          },
          {
            question: 'Do you offer beginner-friendly classes?',
            answer: richText(paragraph('Absolutely. Several seeded workshops are designed specifically for home brewing beginners.')),
          },
        ],
      },
    ],
    meta: {
      description: 'Small-batch specialty coffee, brew gear and practical workshops from Black Oak Coffee Co.',
      // @ts-ignore
      image: metaImage,
      title: defaultSiteName,
    },
    title: 'Home',
  }
}
