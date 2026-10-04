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
    // The banner is a block, so it scrolls, rotates and reorders with
    // everything else on the page rather than living in its own field.
    hero: { type: 'none' },
    layout: [
      {
        blockType: 'heroCarousel',
        autoplay: true,
        minHeight: 'tall',
        slides: [
          {
            heading: 'Coffee Worth Slowing Down For',
            subheading:
              'Small-batch specialty coffee, brewing equipment and hands-on workshops designed to help you enjoy better coffee at home.',
            image: contentImage,
            links: [
              { link: { type: 'custom', appearance: 'default', label: 'Shop Coffee', url: '/shop' } },
              { link: { type: 'custom', appearance: 'outline', label: 'Book a Workshop', url: '/book' } },
            ],
          },
          {
            heading: 'Roasted in small batches, every week',
            subheading:
              'Seasonal single origins and espresso blends, roasted to order and dispatched within 48 hours.',
            image: contentImage,
            links: [
              { link: { type: 'custom', appearance: 'default', label: 'Browse this season', url: coffeeHref } },
            ],
          },
          {
            heading: 'Learn to brew it properly',
            subheading:
              'Practical workshops for beginners and home baristas, led by the people who roast the coffee.',
            image: contentImage,
            links: [
              { link: { type: 'custom', appearance: 'default', label: 'See upcoming sessions', url: '/book' } },
            ],
          },
        ],
        highlights: [
          { title: 'Roasted to order', description: 'Dispatched within 48 hours of roasting.' },
          { title: 'Free UK delivery', description: 'On every order over £40.' },
          { title: 'Taught by roasters', description: 'Workshops run by the team themselves.' },
        ],
      },
      {
        blockType: 'marquee',
        items: [
          { label: 'Single origin' },
          { label: 'Espresso blends' },
          { label: 'Brewing equipment' },
          { label: 'Subscriptions' },
          { label: 'Workshops' },
          { label: 'Gift sets' },
        ],
      },
      {
        blockType: 'splitFeature',
        background: 'default',
        eyebrow: 'Our story',
        title: 'Small-batch roasted coffee for everyday rituals',
        description:
          'Black Oak Coffee Co. sources exceptional coffees, roasts in small batches and helps customers brew better through practical workshops and guides.',
        richText: richText(
          paragraph(
            'Founded in 2018, we started with a simple mission: make exceptional coffee approachable. Today we roast in small batches, publish practical brew guides, and host workshops for home baristas and curious beginners alike.',
          ),
        ),
        points: [
          { text: 'Seasonal coffees, rotated as harvests land' },
          { text: 'Roast profiles developed for home equipment' },
          { text: 'Tasting notes written by the roasting team' },
        ],
        media: contentImage,
        kenBurns: true,
        imagePosition: 'right',
        enableLink: true,
        link: { type: 'custom', appearance: 'outline', label: 'Read our story', url: '/about' },
      },
      {
        blockType: 'stats',
        background: 'inverse',
        spacing: 'tight',
        layout: 'cards',
        countUp: true,
        items: [
          { value: '4.9', label: 'Average workshop rating', iconName: 'star' },
          { value: '12+', label: 'Seasonal single origins', iconName: 'leaf' },
          { value: '2400+', label: 'Monthly subscribers', iconName: 'users' },
          { value: '48', label: 'Hours from roast to dispatch', iconName: 'timer' },
        ],
      },
      {
        blockType: 'productShowcase',
        background: 'muted',
        align: 'left',
        eyebrow: 'Customer favourites',
        title: 'Best-selling coffees & bundles',
        description: 'Curated picks from our roastery — updated with the seasons.',
        layout: 'carousel',
        populateBy: 'collection',
        limit: 8,
        enableViewAllLink: true,
        link: { type: 'custom', appearance: 'outline', label: 'View all products', url: '/shop' },
      },
      {
        blockType: 'splitFeature',
        background: 'soft',
        eyebrow: 'For subscribers',
        title: 'Fresh coffee, arriving when you need it',
        description:
          'Pick a roast style and a frequency. Skip, swap or pause at any time from your account.',
        points: [
          { text: 'Choose your grind and bag size' },
          { text: 'Skip or pause a delivery whenever you like' },
          { text: 'Subscriber-only access to micro-lots' },
        ],
        media: contentImage,
        kenBurns: true,
        imagePosition: 'left',
        enableLink: true,
        link: { type: 'custom', appearance: 'default', label: 'Explore subscriptions', url: bundlesHref },
      },
      {
        blockType: 'serviceShowcase',
        background: 'default',
        eyebrow: 'Learn with us',
        title: 'Popular workshops',
        description: 'Practical sessions covering brew fundamentals, espresso setup and sensory skills.',
        populateBy: 'collection',
        limit: 3,
        enableViewAllLink: true,
        link: { type: 'custom', appearance: 'outline', label: 'View all sessions', url: '/book' },
      },
      {
        blockType: 'features',
        background: 'muted',
        align: 'center',
        eyebrow: 'Why people choose us',
        title: 'Good coffee, explained properly',
        description:
          'Everything we sell comes with the context you need to get the best out of it.',
        layout: 'cards',
        items: [
          {
            title: 'Roasted to order',
            iconName: 'timer',
            description: richText(paragraph('Nothing sits in a warehouse. We roast weekly and ship immediately.')),
          },
          {
            title: 'Traceable sourcing',
            iconName: 'compass',
            description: richText(paragraph('Farm, varietal and process on every bag, not just a country name.')),
          },
          {
            title: 'Brewing support',
            iconName: 'lifeBuoy',
            description: richText(paragraph('Practical guides and a team who will happily talk you through a recipe.')),
          },
          {
            title: 'Equipment that lasts',
            iconName: 'wrench',
            description: richText(paragraph('Gear we use ourselves, chosen to be repairable rather than replaceable.')),
          },
          {
            title: 'Taught by roasters',
            iconName: 'graduationCap',
            description: richText(paragraph('Workshops run by the people who actually roast the coffee.')),
          },
          {
            title: 'Satisfaction guarantee',
            iconName: 'badgeCheck',
            description: richText(paragraph('If a bag is not right for you, tell us and we will put it right.')),
          },
        ],
      },
      {
        blockType: 'features',
        background: 'default',
        eyebrow: 'Browse',
        title: 'Featured Categories',
        layout: 'linkedCards',
        items: [
          {
            title: 'Single Origin Coffee',
            iconName: 'leaf',
            description: richText(paragraph('Distinct origin character with seasonal rotation.')),
            ...categoryLink('Shop single origin', coffeeHref),
          },
          {
            title: 'Espresso Blends',
            iconName: 'coffee',
            description: richText(paragraph('Balanced blends for home espresso and milk drinks.')),
            ...categoryLink('Shop espresso blends', coffeeHref),
          },
          {
            title: 'Brewing Equipment',
            iconName: 'wrench',
            description: richText(paragraph('Tools to improve consistency and extraction at home.')),
            ...categoryLink('Shop equipment', '/shop'),
          },
          {
            title: 'Gift Sets',
            iconName: 'gift',
            description: richText(paragraph('Curated bundles ideal for gifting and first-time exploration.')),
            ...categoryLink('Shop gift sets', bundlesHref),
          },
          {
            title: 'Coffee Subscriptions',
            iconName: 'package',
            description: richText(paragraph('Recurring monthly deliveries tailored to brew preferences.')),
            ...categoryLink('Explore subscriptions', bundlesHref),
          },
          {
            title: 'Workshops',
            iconName: 'graduationCap',
            description: richText(paragraph('Hands-on sessions for brewing, espresso and sensory skills.')),
            ...categoryLink('Book a workshop', '/book'),
          },
        ],
      },
      {
        blockType: 'testimonials',
        background: 'soft',
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
        blockType: 'faq',
        background: 'default',
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
        blockType: 'cta',
        background: 'inverse',
        spacing: 'tight',
        layout: 'splitPanel',
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Session', url: '/book' } },
        ],
        richText: richText(
          heading('Learn From Our Roasters', 'h3'),
          paragraph(
            'Join tastings and practical workshops covering brew fundamentals, espresso setup, milk texturing and sensory skills.',
          ),
        ),
      },
      {
        blockType: 'newsletter',
        background: 'muted',
        align: 'center',
        eyebrow: 'Stay in the loop',
        title: 'Get brew guides and early access to new coffees',
        description: 'Monthly tips, seasonal releases and workshop dates — straight to your inbox.',
        placeholder: 'you@example.com',
        buttonLabel: 'Join the list',
        successMessage: 'Thanks — check your inbox for a welcome note.',
        privacyNote: 'No spam. Unsubscribe any time.',
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
