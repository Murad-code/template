import type { Media, Product } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

import { paragraph, heading, richText } from './home'

type BlockShowcaseArgs = {
  metaImage: Media
  contentImage: Media
  contactFormId: number
  products: Product[]
  categoryIds?: {
    coffee?: number | string
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

/** Reference page with one instance of each layout block for admin/dev review. */
export const blockShowcasePageData: (
  args: BlockShowcaseArgs,
) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
  contentImage,
  contactFormId,
  products,
  categoryIds,
}) => {
  const coffeeHref = categoryIds?.coffee ? `/shop?category=${categoryIds.coffee}` : '/shop'
  const gridProducts = products.length >= 3 ? products.slice(0, 3).map((product) => product.id) : []

  const layout: RequiredDataFromCollectionSlug<'pages'>['layout'] = [
    {
      blockType: 'content',
      blockName: 'Content',
      columns: [
        {
          size: 'full',
          enableLink: false,
          richText: richText(
            heading('Content block', 'h2'),
            paragraph('Rich text columns — full, half, or third width.'),
          ),
        },
      ],
    },
    {
      blockType: 'features',
      blockName: 'Features Cards',
      title: 'Features — cards layout',
      layout: 'cards',
      items: [
        { title: 'Card one', description: richText(paragraph('Default card grid layout.')) },
        {
          title: 'Card two',
          description: richText(paragraph('Optional icons and links available in CMS.')),
        },
      ],
    },
    {
      blockType: 'features',
      blockName: 'Features Minimal',
      title: 'Features — minimal layout',
      layout: 'minimal',
      items: [
        { title: 'Minimal item', description: richText(paragraph('Border-left minimal style.')) },
      ],
    },
    {
      blockType: 'features',
      blockName: 'Features Linked',
      title: 'Features — linked cards',
      layout: 'linkedCards',
      items: [
        {
          title: 'Linked category card',
          description: richText(paragraph('Entire card links when enable link is set.')),
          ...categoryLink('Shop coffee', coffeeHref),
        },
      ],
    },
    {
      blockType: 'stats',
      blockName: 'Stats Bar',
      title: 'Stats — bar layout',
      layout: 'bar',
      items: [
        { value: '4.9★', label: 'Rating' },
        { value: '12+', label: 'Origins' },
      ],
    },
    {
      blockType: 'stats',
      blockName: 'Stats Cards',
      title: 'Stats — cards layout',
      layout: 'cards',
      items: [{ value: '30-day', label: 'Guarantee' }],
    },
    {
      blockType: 'logoCloud',
      blockName: 'Logo Cloud Grid',
      title: 'Logo cloud — grid',
      layout: 'grid',
      logos: [{ label: 'Partner A' }, { label: 'Partner B' }, { label: 'Partner C' }],
    },
    {
      blockType: 'logoCloud',
      blockName: 'Logo Cloud Marquee',
      title: 'Logo cloud — marquee',
      layout: 'marquee',
      logos: [{ label: 'Marquee 1' }, { label: 'Marquee 2' }, { label: 'Marquee 3' }],
    },
    {
      blockType: 'mediaBlock',
      blockName: 'Media',
      media: contentImage,
    },
    {
      blockType: 'productShowcase',
      blockName: 'Product Showcase Grid',
      title: 'Product showcase — grid',
      layout: 'grid',
      populateBy: 'collection',
      limit: 4,
      enableViewAllLink: true,
      link: { type: 'custom', appearance: 'outline', label: 'View shop', url: '/shop' },
    },
    {
      blockType: 'productShowcase',
      blockName: 'Product Showcase Carousel',
      title: 'Product showcase — carousel',
      layout: 'carousel',
      populateBy: 'collection',
      limit: 6,
      enableViewAllLink: false,
    },
    ...(gridProducts.length === 3
      ? [
          {
            blockType: 'threeItemGrid' as const,
            blockName: 'Three Item Grid',
            products: gridProducts,
          },
        ]
      : []),
    {
      blockType: 'carousel',
      blockName: 'Carousel',
      populateBy: 'collection',
      relationTo: 'products',
      limit: 6,
    },
    {
      blockType: 'archive',
      blockName: 'Archive',
      populateBy: 'collection',
      relationTo: 'products',
      limit: 3,
      introContent: richText(
        heading('Archive block', 'h2'),
        paragraph('Product archive grid with optional intro rich text.'),
      ),
    },
    {
      blockType: 'splitFeature',
      blockName: 'Split Feature',
      title: 'Split feature / brand story',
      description: 'Image and text side by side.',
      media: contentImage,
      imagePosition: 'right',
      enableLink: true,
      link: { type: 'custom', appearance: 'outline', label: 'Learn more', url: '/about' },
    },
    {
      blockType: 'serviceShowcase',
      blockName: 'Service Showcase',
      title: 'Service showcase',
      description: 'Booking services grid (hidden when booking is disabled).',
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
      blockName: 'Testimonials Grid',
      title: 'Testimonials — grid',
      layout: 'grid',
      items: [
        {
          quote: 'Example testimonial for the grid layout.',
          author: 'Alex R.',
          role: 'Customer',
          rating: 5,
        },
      ],
    },
    {
      blockType: 'testimonials',
      blockName: 'Testimonials Carousel',
      title: 'Testimonials — carousel',
      layout: 'carousel',
      items: [
        {
          quote: 'Example testimonial for the carousel layout.',
          author: 'Sam T.',
          role: 'Subscriber',
          rating: 5,
        },
      ],
    },
    {
      blockType: 'cta',
      blockName: 'Call to Action',
      layout: 'splitPanel',
      richText: richText(
        heading('Call to action block', 'h2'),
        paragraph('Prominent panel with links.'),
      ),
      links: [
        {
          link: { type: 'custom', appearance: 'default', label: 'Primary action', url: '/shop' },
        },
      ],
    },
    {
      blockType: 'faq',
      blockName: 'FAQ',
      title: 'FAQ block',
      items: [
        {
          question: 'Example question?',
          answer: richText(paragraph('Accordion FAQ answer content.')),
        },
      ],
    },
    {
      blockType: 'formBlock',
      blockName: 'Form',
      form: contactFormId,
      enableIntro: true,
      introContent: richText(
        heading('Form block', 'h2'),
        paragraph('Embeds a Payload form builder form.'),
      ),
    },
    {
      blockType: 'newsletter',
      blockName: 'Newsletter',
      title: 'Newsletter signup',
      description: 'Email capture with optional privacy note.',
    },
    {
      blockType: 'banner',
      blockName: 'Banner Info',
      style: 'info',
      content: richText(paragraph('Banner — info style')),
    },
    {
      blockType: 'banner',
      blockName: 'Banner Promo',
      style: 'promo',
      content: richText(paragraph('Banner — promo style')),
    },
    {
      blockType: 'banner',
      blockName: 'Banner Success',
      style: 'success',
      content: richText(paragraph('Banner — success style')),
    },
  ] as RequiredDataFromCollectionSlug<'pages'>['layout']

  return {
    slug: 'block-showcase',
    title: 'Block Showcase',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText(
        heading('Layout block showcase', 'h1'),
        paragraph(
          'Reference page listing every page builder block. Use this to preview styling and CMS options before composing marketing pages.',
        ),
      ),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Back to Home',
            url: '/',
          },
        },
      ],
    },
    layout,
    meta: {
      title: 'Block Showcase | Demo',
      description: 'Reference page for all Payload layout blocks.',
      // @ts-ignore
      image: metaImage,
    },
  }
}
