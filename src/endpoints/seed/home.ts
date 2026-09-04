import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

const defaultSiteName = process.env.SITE_NAME || 'Black Oak Coffee Co.'

function textNode(text: string): any {
  return { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }
}

export function paragraph(text: string): any {
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

export function heading(text: string, tag: 'h1' | 'h2' | 'h3' = 'h2'): any {
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

export function richText(...children: any[]): any {
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

type ProductArgs = {
  metaImage: Media
  contentImage: Media
  categoryIds?: {
    coffee?: number | string
    bundles?: number | string
  }
}

const categoryLink = (label: string, url: string) => ({
  enableLink: true,
  link: {
    type: 'custom' as const,
    appearance: 'default' as const,
    label,
    url,
  },
})

export const homePageData: (args: ProductArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
  contentImage,
  categoryIds,
}) => {
  const coffeeHref = categoryIds?.coffee ? `/shop?category=${categoryIds.coffee}` : '/shop'
  const bundlesHref = categoryIds?.bundles ? `/shop?category=${categoryIds.bundles}` : '/shop'

  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'landingSplit',
      enableTrustRow: true,
      trustItems: [
        { text: '4.9★ average from workshop guests' },
        { text: 'Small-batch roasting in London' },
        { text: 'Free shipping over £40' },
      ],
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
      media: contentImage,
      richText: richText(
        heading('Coffee Worth Slowing Down For', 'h1'),
        paragraph(
          'Small-batch specialty coffee, brewing equipment and hands-on workshops designed to help you enjoy better coffee at home.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'stats',
        layout: 'bar',
        items: [
          { value: '4.9★', label: 'Average workshop rating' },
          { value: '12+', label: 'Seasonal single origins' },
          { value: '2,400+', label: 'Monthly subscribers' },
          { value: '30-day', label: 'Satisfaction guarantee' },
        ],
      },
      {
        blockType: 'logoCloud',
        align: 'center',
        eyebrow: 'Trusted by coffee lovers',
        title: 'Featured in',
        layout: 'marquee',
        logos: [
          { label: 'London Coffee Guide' },
          { label: 'Barista Magazine' },
          { label: 'Specialty Food' },
          { label: 'Roasters Guild' },
          { label: 'Home Brew Weekly' },
          { label: 'Craft Drinks' },
        ],
      },
      {
        blockType: 'features',
        title: 'Featured Categories',
        layout: 'linkedCards',
        items: [
          {
            title: 'Single Origin Coffee',
            description: richText(paragraph('Distinct origin character with seasonal rotation.')),
            ...categoryLink('Shop single origin', coffeeHref),
          },
          {
            title: 'Espresso Blends',
            description: richText(paragraph('Balanced blends for home espresso and milk drinks.')),
            ...categoryLink('Shop espresso blends', coffeeHref),
          },
          {
            title: 'Brewing Equipment',
            description: richText(paragraph('Tools to improve consistency and extraction at home.')),
            ...categoryLink('Shop equipment', '/shop'),
          },
          {
            title: 'Gift Sets',
            description: richText(paragraph('Curated bundles ideal for gifting and first-time exploration.')),
            ...categoryLink('Shop gift sets', bundlesHref),
          },
          {
            title: 'Coffee Subscriptions',
            description: richText(paragraph('Recurring monthly deliveries tailored to brew preferences.')),
            ...categoryLink('Explore subscriptions', bundlesHref),
          },
          {
            title: 'Workshops',
            description: richText(paragraph('Hands-on sessions for brewing, espresso and sensory skills.')),
            ...categoryLink('Book a workshop', '/book'),
          },
        ],
      },
      {
        blockType: 'productShowcase',
        align: 'left',
        eyebrow: 'Customer favourites',
        title: 'Best-selling coffees & bundles',
        description: 'Curated picks from our roastery — updated with the seasons.',
        layout: 'carousel',
        populateBy: 'collection',
        limit: 8,
        enableViewAllLink: true,
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'View all products',
          url: '/shop',
        },
      },
      {
        blockType: 'splitFeature',
        eyebrow: 'Our story',
        title: 'Small-batch roasted coffee for everyday rituals',
        description:
          'Black Oak Coffee Co. sources exceptional coffees, roasts in small batches and helps customers brew better through practical workshops and guides.',
        richText: richText(
          paragraph(
            'Founded in 2018, we started with a simple mission: make exceptional coffee approachable. Today we roast in small batches, publish practical brew guides, and host workshops for home baristas and curious beginners alike.',
          ),
        ),
        media: contentImage,
        imagePosition: 'right',
        enableLink: true,
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Read our story',
          url: '/about',
        },
      },
      {
        blockType: 'serviceShowcase',
        eyebrow: 'Learn with us',
        title: 'Popular workshops',
        description: 'Practical sessions covering brew fundamentals, espresso setup and sensory skills.',
        populateBy: 'collection',
        limit: 3,
        enableViewAllLink: true,
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'View all sessions',
          url: '/book',
        },
      },
      {
        blockType: 'testimonials',
        align: 'center',
        eyebrow: 'Customer stories',
        title: 'Loved by home brewers and café regulars',
        layout: 'grid',
        items: [
          {
            quote:
              'The home brewing workshop completely changed how I make coffee. Clear, practical and genuinely fun.',
            author: 'Sarah M.',
            role: 'Workshop guest',
            rating: 5,
          },
          {
            quote:
              'Best subscription I have signed up for. Fresh roasts, helpful tasting notes, and great support.',
            author: 'James T.',
            role: 'Monthly subscriber',
            rating: 5,
          },
          {
            quote:
              'Beautiful coffee, thoughtful packaging, and a team that clearly cares about quality.',
            author: 'Priya K.',
            role: 'Online customer',
            rating: 5,
          },
        ],
      },
      {
        blockType: 'cta',
        layout: 'splitPanel',
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
            answer: richText(paragraph('Absolutely. Several workshops are designed specifically for home brewing beginners.')),
          },
        ],
      },
      {
        blockType: 'newsletter',
        align: 'center',
        eyebrow: 'Stay in the loop',
        title: 'Get brew guides and early access to new coffees',
        description: 'Monthly tips, seasonal releases and workshop dates — straight to your inbox.',
        placeholder: 'you@example.com',
        buttonLabel: 'Join the list',
        successMessage: 'Thanks — check your inbox for a welcome note.',
        privacyNote: 'No spam. Unsubscribe any time.',
      },
      {
        blockType: 'banner',
        style: 'promo',
        content: richText(
          paragraph('Free UK shipping on orders over £40. Freshly roasted within 48 hours of dispatch.'),
        ),
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
