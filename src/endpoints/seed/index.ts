import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import { RequiredDataFromCollectionSlug } from 'payload'
import fs from 'fs/promises'
import path from 'path'

import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'
import { discoverSeedDir } from './discover'
import { readLocalFile } from './localFile'
import { slugify } from './marquee-product'
import { upsertThemePalettes } from '@/utilities/themePalettes'
import { Address, Transaction } from '@/payload-types'
import type { Header, Footer, Media, Product, SiteTheme } from '@/payload-types'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
  'booking-transactions',
  'bookings',
  'booking-waitlist',
  'booking-slots',
  'services',
  'theme-palettes',
]

const globals: GlobalSlug[] = ['header', 'footer', 'site-theme']

const baseAddressUKData: Transaction['billingAddress'] = {
  title: 'Mr.',
  firstName: 'Oliver',
  lastName: 'Twist',
  phone: '1234567890',
  addressLine1: '48 Great Portland St',
  city: 'London',
  postalCode: 'W1W 7ND',
  country: 'GB',
}
const SEEDED_CUSTOMER_EMAIL = 'customer@blackoakdemo.local'
const SEEDED_CONTACT_EMAIL = 'muradk2512@gmail.com'

export type SeedMode = 'ecommerce' | 'booking' | 'hybrid'

type CoffeeProductSeed = {
  folderName: string
  title: string
  slug: string
  priceInGBP: number
  subtitle?: string
  tastingNotes?: string
  categorySlug: string
  shortDescription: string
  sections?: string[]
  brewNotes?: string[]
  preferredImageOrder?: string[]
  inventory: number
  lowStockThreshold: number
}

type ServiceSeed = {
  name: string
  slug: string
  durationMinutes: number
  priceInGBP: number
  description: string
  category: 'tasting' | 'home-brewing' | 'espresso' | 'advanced'
  imageFileName: string
}

function lexicalParagraph(text: string): any {
  return {
    type: 'paragraph',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function lexicalHeading(text: string, tag: 'h1' | 'h2' | 'h3' = 'h2'): any {
  return {
    type: 'heading',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    version: 1,
  }
}

function richTextFrom(...children: Array<ReturnType<typeof lexicalParagraph> | ReturnType<typeof lexicalHeading>>): any {
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

async function optionalSeedImage(...segments: string[]): Promise<string | null> {
  const absolutePath = path.join(process.cwd(), 'seed', ...segments)
  try {
    await fs.access(absolutePath)
    return absolutePath
  } catch {
    return null
  }
}

const categorySeeds = [
  { title: 'Coffee', slug: 'coffee' },
  { title: 'Tea', slug: 'tea' },
  { title: 'Coffee Bundles', slug: 'coffee-bundles' },
  { title: 'Tea Bundles', slug: 'tea-bundles' },
]

const productSeeds: CoffeeProductSeed[] = [
  {
    folderName: 'black-oak-pack-bestseller-bundle',
    title: 'Bestseller Bundle',
    slug: 'bestseller-bundle',
    priceInGBP: 3900,
    categorySlug: 'coffee-bundles',
    subtitle: 'Duomo, Black Bart and Heartwood',
    tastingNotes: 'Caramel, molasses, smoky cocoa',
    shortDescription:
      'Our most popular bundle featuring medium and dark roast profiles to compare caramel sweetness against bolder smoky depth.',
    sections: [
      'Heartwood: a medium blend of two roast levels with toasted milk chocolate character and a bright, clean finish.',
      'Duomo: a full-bodied Northern Italian style espresso blend with rich roast flavor and bittersweet balance.',
      'Black Bart: dark and smoky with full-bodied sweetness, designed for black coffee or milk-based drinks.',
      'Pro-Tip: this bundle qualifies for free shipping.',
    ],
    brewNotes: ['Use our brew guides as a starting point and adjust ratio to taste for your preferred brewer.'],
    inventory: 80,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-black-bart',
    title: 'Black Bart',
    slug: 'black-bart',
    priceInGBP: 1300,
    categorySlug: 'coffee',
    subtitle: 'Dark Roast',
    tastingNotes: 'Earthy, smoky, sweet. Burnt sugar and bittersweet chocolate.',
    shortDescription:
      'A uniquely enjoyable dark roast blending coffees roasted to light, medium and deep profiles for complexity and sweetness.',
    sections: [
      'Named after the outlaw Black Bart, this blend is intentionally bold while remaining layered and approachable.',
      'Designed to pair equally well with savory breakfasts, milk and sugar, or served straight black.',
    ],
    brewNotes: ['For drip coffee, use roughly 14:1 to 16:1 water-to-coffee ratio.'],
    inventory: 6,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-duomo-and-heartwood-coffee-roasters',
    title: 'Duomo + Heartwood Bundle',
    slug: 'duomo-heartwood-bundle',
    priceInGBP: 2600,
    categorySlug: 'coffee-bundles',
    tastingNotes: 'Milk chocolate, bittersweet espresso, clean finish',
    shortDescription:
      'Two of our most popular drip and espresso blends in one bundle, balancing sweetness, body and daily drinkability.',
    sections: [
      'Heartwood: medium blend with toasted milk chocolate profile and clean lingering finish, ideal for drip brewing.',
      'Duomo: full-bodied Northern Italian style espresso blend with rich roast flavor and balanced bittersweetness.',
      "This bundle has a coupon code applied and further coupons won't apply.",
    ],
    inventory: 45,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-chamomile-lemongrass',
    title: 'Chamomile Lemongrass Tea',
    slug: 'chamomile-lemongrass-tea',
    priceInGBP: 900,
    categorySlug: 'tea',
    tastingNotes: 'Floral, citrus, mint',
    shortDescription:
      'A balanced tisane where citrus fruit sweetness meets warm floral notes, finished with cooling mint.',
    sections: [
      'Warm floral notes float above sweet lemongrass, bergamot and citrus for a summer-like cup profile.',
      'Origin: Germany.',
      'Net Wt - 50g (1.76oz).',
    ],
    brewNotes: [
      'Steep two grams per 12oz cup in 208F water for 5-10 minutes.',
      'For iced tea, brew with half the water volume, then pour over an equal amount of ice.',
    ],
    preferredImageOrder: ['product-shot', 'macro-2'],
    inventory: 65,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-earl-grey',
    title: 'Earl Grey Tea',
    slug: 'earl-grey-tea',
    priceInGBP: 800,
    categorySlug: 'tea',
    tastingNotes: 'Bergamot, malt, vanilla',
    shortDescription:
      'A timeless blend of strong black tea and lively bergamot aroma, enjoyable black or with milk and sweetener.',
    sections: [
      'Rich, warm and comforting with floral-citrus bergamot over a robust breakfast-tea base.',
      'Origin: Sri Lanka/Germany.',
      'Net Wt - 100g (3.52oz).',
    ],
    brewNotes: [
      'For black tea: 3-4g per 8-10oz, 205F, steep 4 minutes.',
      'For milk/sweetener pairing: 4g per 8oz, 208-210F, steep 5 minutes.',
    ],
    inventory: 52,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-ceylon-black',
    title: 'Ceylon Black Tea',
    slug: 'ceylon-black-tea',
    priceInGBP: 800,
    categorySlug: 'tea',
    tastingNotes: 'Turbinado, dried fruits, citrus',
    shortDescription:
      'Deep, rich tea with heavy body and complex aroma, selected for its lighter floral quality and lower tannic intensity.',
    sections: [
      'Grown in Sri Lanka from younger leaves nearest the growing tips for balanced richness and reduced pungency.',
      'Origin: Sri Lanka.',
    ],
    brewNotes: [
      'Steep 3-4g per 8-10oz at 205-208F for 3-5 minutes.',
      'With milk/sweetener: 4g per 8oz at 208-210F for 5 minutes.',
    ],
    inventory: 49,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-kyoto-sencha-green',
    title: 'Kyoto Sencha Green',
    slug: 'kyoto-sencha-green',
    priceInGBP: 1000,
    categorySlug: 'tea',
    tastingNotes: 'Oceanic, green vegetal, toasted nuts',
    shortDescription:
      'A blend of first flush and summer harvest Kyoto leaves for delicate freshness and warm, rounded intensity.',
    sections: [
      'Produced in southern Kyoto Prefecture, renowned for some of Japans highest quality green tea.',
      'A brief steaming process halts oxidation before leaves are rolled and dried for steeping.',
      'Origin: Kyoto Prefecture, Japan.',
      'Net Wt - 100g (3.52oz).',
    ],
    brewNotes: [
      'Start with 3-4g per 8-10oz cup at 175F for 1 minute.',
      'Increase intensity with slightly hotter water (180-185F) and/or a longer steep (1:15-1:30).',
    ],
    preferredImageOrder: ['kyoto-sencha-green.jpg', 'macro-2'],
    inventory: 7,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-artisan-green-tea-bundle',
    title: 'Artisan Green Tea Bundle',
    slug: 'artisan-green-tea-bundle',
    priceInGBP: 1900,
    categorySlug: 'tea-bundles',
    tastingNotes: 'Jasmine sweetness, fresh vegetal clarity',
    shortDescription:
      'A premium green tea bundle pairing silver-tip Yin Hao Jasmine with Kyoto Sencha for refreshing, antioxidant-rich cups.',
    sections: [
      'Features two distinct profiles: ethereal floral jasmine sweetness and delicately structured Japanese sencha character.',
      'Sourced from respected tea-growing regions in China and Japan.',
    ],
    inventory: 38,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-yin-hao-jasmine',
    title: 'Yin Hao Jasmine Tea',
    slug: 'yin-hao-jasmine-tea',
    priceInGBP: 1100,
    categorySlug: 'tea',
    tastingNotes: 'Floral, fresh, delicate',
    shortDescription:
      'Top grade silver-tip green tea massaged with drying jasmine blossoms for an ethereal floral aroma and sweet, delicate finish.',
    sections: [
      'Grown in Fujian Province, China, one of the most respected tea regions with ideal coastal mountain growing conditions.',
      'Yin Hao means silver tips, harvested from budding spring leaf tips for a delicate profile with less grassy character.',
      'Spring-dried tea is later massaged with fresh jasmine blossoms at full bloom to naturally infuse floral sweetness.',
      'Origin: Fujian Province, China.',
      'Net Wt - 80g (2.82oz).',
    ],
    brewNotes: [
      'Steep 3-4g (1-2 tbsp) per 8-10oz cup at 185F for 1:45.',
      'Adjust steep time to tune intensity; higher temperature and longer steep increase astringency.',
      'For iced tea, brew with half water volume (4-5oz) and pour directly over equal ice volume.',
    ],
    inventory: 32,
    lowStockThreshold: 10,
  },
  {
    folderName: 'black-oak-pack-meadow',
    title: 'Meadow',
    slug: 'meadow-organic-medium-roast',
    priceInGBP: 1400,
    categorySlug: 'coffee',
    subtitle: 'Organic Medium Roast',
    tastingNotes: 'Chocolate, caramel, almond',
    shortDescription:
      'A smooth and moderately sweet organic medium roast inspired by the open meadows of Northern California.',
    sections: [
      'Perfect for your next adventure, Meadow is roasted gently to bring out rich chocolate and caramel notes while staying balanced.',
      'Black Oak Coffee donates 10% of profits from the organic line to California State Parks Foundation supporting trail maintenance, habitat restoration and public access.',
      'Inspired by the wild places of the Trinity Alps, this blend is designed for unhurried, everyday brewing.',
    ],
    inventory: 41,
    lowStockThreshold: 10,
  },
]

const serviceSeeds: ServiceSeed[] = [
  {
    name: 'Coffee Tasting Experience',
    slug: 'coffee-tasting-experience',
    durationMinutes: 90,
    priceInGBP: 2500,
    description:
      'Explore four carefully selected coffees from different origins while learning how processing, roasting and brewing influence flavour.',
    category: 'tasting',
    imageFileName: 'coffee-tasting-experience.jpg',
  },
  {
    name: 'Brew Better Coffee at Home',
    slug: 'brew-better-coffee-at-home',
    durationMinutes: 120,
    priceInGBP: 4500,
    description:
      'Learn grind size, water temperature and extraction principles for consistently excellent coffee at home.',
    category: 'home-brewing',
    imageFileName: 'brew-better-coffee-at-home.jpg',
  },
  {
    name: 'Introduction to Espresso',
    slug: 'introduction-to-espresso',
    durationMinutes: 150,
    priceInGBP: 6500,
    description: 'Master espresso preparation, shot dialing and milk steaming on professional equipment.',
    category: 'espresso',
    imageFileName: 'introduction-to-espresso.jpg',
  },
  {
    name: 'Latte Art Workshop',
    slug: 'latte-art-workshop',
    durationMinutes: 120,
    priceInGBP: 5500,
    description: 'Practice pouring hearts, tulips and rosettas with one-to-one coaching.',
    category: 'espresso',
    imageFileName: 'latte-art-workshop.jpg',
  },
  {
    name: 'Coffee Roasting Fundamentals',
    slug: 'coffee-roasting-fundamentals',
    durationMinutes: 180,
    priceInGBP: 8500,
    description: 'Understand roast development through guided live roasting demonstrations and cupping.',
    category: 'advanced',
    imageFileName: 'coffee-roasting-fundamentals.jpg',
  },
  {
    name: 'Cupping and Sensory Training',
    slug: 'cupping-and-sensory-training',
    durationMinutes: 90,
    priceInGBP: 3500,
    description: 'Develop your palate and learn structured tasting methods used by roasting teams.',
    category: 'tasting',
    imageFileName: 'cupping-and-sensory-training.jpg',
  },
  {
    name: 'Home Barista Masterclass',
    slug: 'home-barista-masterclass',
    durationMinutes: 240,
    priceInGBP: 12000,
    description: 'A complete workshop covering espresso workflow, milk texturing and equipment care.',
    category: 'advanced',
    imageFileName: 'home-barista-masterclass.jpg',
  },
]

const marketingPages = [
  {
    title: 'Workshops',
    slug: 'workshops',
    heroHeading: 'Learn From Our Roasters',
    heroText:
      'Hands-on sessions from brewing fundamentals to home espresso mastery, led by experienced trainers.',
    ctaLabel: 'Book a Session',
    ctaUrl: '/book',
  },
  {
    title: 'Gift Cards',
    slug: 'gift-cards',
    heroHeading: 'Digital Gift Cards',
    heroText:
      'Offer coffee lovers the freedom to choose beans, gear and workshops with digital gift cards from £10 to £100.',
    ctaLabel: 'Shop Gift Sets',
    ctaUrl: '/shop',
  },
  {
    title: 'Corporate Workshops',
    slug: 'corporate-workshops',
    heroHeading: 'Coffee Team Experiences',
    heroText:
      'Private workshop formats for teams, agencies and offices looking for memorable, hands-on learning sessions.',
    ctaLabel: 'Contact Us',
    ctaUrl: '/contact',
  },
  {
    title: 'Private Events',
    slug: 'private-events',
    heroHeading: 'Private Coffee Events',
    heroText:
      'Book bespoke tastings and guided brewing sessions for birthdays, celebrations and small groups.',
    ctaLabel: 'Enquire Today',
    ctaUrl: '/contact',
  },
  {
    title: 'Subscriptions',
    slug: 'subscriptions',
    heroHeading: 'Coffee Subscription Service',
    heroText:
      'Recurring monthly coffee deliveries tailored to your brew method and flavour preferences.',
    ctaLabel: 'View Plans',
    ctaUrl: '/shop',
  },
  {
    title: 'Wholesale Enquiries',
    slug: 'wholesale',
    heroHeading: 'Wholesale Coffee Supply',
    heroText:
      'Freshly roasted coffee for cafes, restaurants and offices with flexible training and support packages.',
    ctaLabel: 'Start a Wholesale Enquiry',
    ctaUrl: '/contact',
  },
  {
    title: 'Testimonials',
    slug: 'testimonials',
    heroHeading: 'What Customers Say',
    heroText:
      'Feedback from workshop guests and subscription customers across Black Oak Coffee Co.',
    ctaLabel: 'Book a Workshop',
    ctaUrl: '/book',
  },
]

const blogGuideTitles = [
  'How to Brew Better Coffee at Home',
  'V60 Brewing Guide for Beginners',
  'French Press vs Pour Over: Which Is Right for You?',
  'Understanding Coffee Origins',
  'What Is Specialty Coffee?',
  'The Importance of Grind Size',
  'Espresso Extraction Explained',
  'How to Store Coffee Properly',
  'Light Roast vs Dark Roast',
  "Beginner's Guide to Latte Art",
]

// Next.js revalidation errors are normal when seeding the database without a server running
export const seed = async ({
  payload,
  req,
  mode = 'ecommerce',
}: {
  payload: Payload
  req: PayloadRequest
  mode?: SeedMode
}): Promise<void> => {
  const seedContext = {
    disableRevalidate: true,
    disableEmail: true,
  }

  payload.logger.info(`Seeding database (mode: ${mode})...`)

  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all(
    globals.map((global) => {
      const data =
        global === 'site-theme'
          ? ({ paletteMode: 'palette', palette: null } as Partial<SiteTheme>)
          : ({ navItems: [] } as Partial<Header> & Partial<Footer>)

      return payload.updateGlobal({
        slug: global,
        data,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
    }),
  )

  for (const collection of collections) {
    if (!payload.collections[collection]) continue
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Deleting demo customer...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: { equals: SEEDED_CUSTOMER_EMAIL },
    },
  })

  payload.logger.info(`— Discovering seed content...`)

  const { productFolders, heroImagePath } = await discoverSeedDir()

  if (productFolders.length === 0) {
    throw new Error('Seed directory contains no product folders with images.')
  }

  const requiredFolderNames = new Set(productSeeds.map((seedProduct) => seedProduct.folderName))
  const selectedProductFolders = productFolders.filter((folder) => requiredFolderNames.has(folder.title))
  const missingFolders = productSeeds
    .map((seedProduct) => seedProduct.folderName)
    .filter((folderName) => !selectedProductFolders.some((folder) => folder.title === folderName))

  if (missingFolders.length > 0) {
    throw new Error(`Seed is missing required product image folders: ${missingFolders.join(', ')}`)
  }

  payload.logger.info(`— Seeding media...`)

  const heroFile = heroImagePath ? await readLocalFile(heroImagePath) : null
  const heroMedia: Media | null = heroFile
    ? await payload.create({
        collection: 'media',
        data: { alt: 'Homepage hero' },
        file: heroFile,
        overwriteExistingFiles: true,
      })
    : null

  const pathToMedia = new Map<string, Media>()
  for (const folder of selectedProductFolders) {
    for (const imagePath of folder.imagePaths) {
      if (pathToMedia.has(imagePath)) continue
      const file = await readLocalFile(imagePath)
      const doc = await payload.create({
        collection: 'media',
        data: { alt: `${folder.title} - ${file.name}` },
        file,
        overwriteExistingFiles: true,
      })
      pathToMedia.set(imagePath, doc)
    }
  }

  const serviceSlugToMedia = new Map<string, Media>()
  for (const serviceSeed of serviceSeeds) {
    const serviceImagePath = await optionalSeedImage('services', serviceSeed.imageFileName)
    if (!serviceImagePath) continue
    const file = await readLocalFile(serviceImagePath)
    const doc = await payload.create({
      collection: 'media',
      data: { alt: `${serviceSeed.name} service image` },
      file,
      overwriteExistingFiles: true,
    })
    serviceSlugToMedia.set(serviceSeed.slug, doc)
  }

  payload.logger.info(`— Seeding categories...`)

  const categories = new Map<string, number>()
  for (const categorySeed of categorySeeds) {
    const createdCategory = await payload.create({
      collection: 'categories',
      data: { title: categorySeed.title, slug: categorySeed.slug },
    })
    categories.set(categorySeed.slug, createdCategory.id)
  }

  payload.logger.info(`— Seeding products...`)

  const products: Product[] = []
  const imagePool = selectedProductFolders
    .flatMap((folder) => folder.imagePaths)
    .map((imagePath) => pathToMedia.get(imagePath))
  const availableImages = imagePool.filter((image): image is Media => Boolean(image))

  if (availableImages.length === 0) {
    throw new Error('No media available for product galleries.')
  }

  for (const productSeed of productSeeds) {
    const categoryId = categories.get(productSeed.categorySlug)
    if (!categoryId) continue

    const matchedFolder = productFolders.find((folder) => folder.title === productSeed.folderName)
    const orderedImagePaths = matchedFolder
      ? [...matchedFolder.imagePaths].sort((a, b) => {
          const preferred = productSeed.preferredImageOrder
          if (!preferred || preferred.length === 0) return a.localeCompare(b)
          const aLower = a.toLowerCase()
          const bLower = b.toLowerCase()
          const aRank = preferred.findIndex((token) => aLower.includes(token.toLowerCase()))
          const bRank = preferred.findIndex((token) => bLower.includes(token.toLowerCase()))
          const normalizedARank = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank
          const normalizedBRank = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank
          if (normalizedARank === normalizedBRank) return a.localeCompare(b)
          return normalizedARank - normalizedBRank
        })
      : []
    const folderImages = orderedImagePaths
      .map((pathValue) => pathToMedia.get(pathValue))
      .filter((image): image is Media => Boolean(image))
    const imageA = folderImages?.[0] ?? availableImages[0]
    const imageB = folderImages?.[1] ?? folderImages?.[0] ?? availableImages[0]

    const data: RequiredDataFromCollectionSlug<'products'> = {
      title: productSeed.title,
      slug: productSeed.slug,
      _status: 'published',
      layout: [],
      categories: [categoryId],
      description: richTextFrom(
        ...(productSeed.subtitle ? [lexicalParagraph(productSeed.subtitle)] : []),
        lexicalParagraph(productSeed.shortDescription),
        ...(productSeed.tastingNotes ? [lexicalParagraph(`Tasting notes: ${productSeed.tastingNotes}.`)] : []),
        ...(productSeed.sections?.map((section) => lexicalParagraph(section)) ?? []),
        ...(productSeed.brewNotes?.length
          ? [lexicalHeading('Brew Notes', 'h3'), ...productSeed.brewNotes.map((note) => lexicalParagraph(note))]
          : []),
      ),
      gallery: [{ image: imageA }, { image: imageB }],
      meta: {
        title: `${productSeed.title} | Black Oak Coffee Co.`,
        image: imageA,
        description: productSeed.tastingNotes
          ? `${productSeed.shortDescription} Tasting notes: ${productSeed.tastingNotes}.`
          : productSeed.shortDescription,
      },
      priceInGBPEnabled: true,
      priceInGBP: productSeed.priceInGBP,
      inventory: productSeed.inventory,
      lowStockThreshold: productSeed.lowStockThreshold,
      relatedProducts: [],
    }

    const product = await payload.create({
      collection: 'products',
      depth: 0,
      data,
    })
    products.push(product as Product)
  }

  const firstProduct = products[0]
  if (!firstProduct) {
    throw new Error('No products created.')
  }

  payload.logger.info(`— Seeding customer...`)

  const customer = await payload.create({
    collection: 'users',
    data: {
      name: 'Customer',
      email: SEEDED_CUSTOMER_EMAIL,
      password: 'password',
      roles: ['customer'],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData(),
  })

  payload.logger.info(`— Seeding pages...`)

  const fallbackImage = availableImages[0]
  const homeImage = heroMedia ?? fallbackImage ?? null
  if (!homeImage) throw new Error('No images available for homepage.')
  await payload.create({
    collection: 'pages',
    depth: 0,
    context: {
      ...seedContext,
    },
    data: homePageData({
      contentImage: homeImage,
      metaImage: homeImage,
    }),
  })

  await payload.create({
    collection: 'pages',
    depth: 0,
    context: {
      ...seedContext,
    },
    data: {
      title: 'About Us',
      slug: 'about',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richTextFrom(
          lexicalHeading('Our Story', 'h1'),
          lexicalParagraph(
            'Founded in 2018, Black Oak Coffee Co. started with a simple mission: make exceptional coffee approachable.',
          ),
        ),
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
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              enableLink: false,
              richText: richTextFrom(
                lexicalParagraph(
                  'What started as a small roasting operation supplying local cafes has grown into a community of coffee enthusiasts who value quality, sustainability and craftsmanship.',
                ),
                lexicalParagraph(
                  'Today, we source coffees from trusted producers around the world, roast in small batches, and help customers get more from every cup through tastings and practical education.',
                ),
              ),
            },
          ],
        },
        {
          blockType: 'features',
          title: 'Our Values',
          items: [
            {
              title: 'Quality First',
              description: richTextFrom(
                lexicalParagraph('Every coffee is carefully sourced, roasted and tested before reaching customers.'),
              ),
            },
            {
              title: 'Sustainable Sourcing',
              description: richTextFrom(
                lexicalParagraph('We work with partners who prioritize ethical and transparent supply chains.'),
              ),
            },
            {
              title: 'Education and Community',
              description: richTextFrom(
                lexicalParagraph('Workshops and brew guides make specialty coffee accessible for all experience levels.'),
              ),
            },
          ],
        },
      ],
      meta: {
        title: 'About Us | Black Oak Coffee Co.',
        description: 'Learn the story and values behind Black Oak Coffee Co.',
        image: homeImage,
      },
    },
  })
  await payload.create({
    collection: 'pages',
    depth: 0,
    context: {
      ...seedContext,
    },
    data: contactPageData({ contactForm }),
  })

  await payload.create({
    collection: 'pages',
    depth: 0,
    context: {
      ...seedContext,
    },
    data: {
      title: 'Blog',
      slug: 'blog',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richTextFrom(
          lexicalHeading('Brew Better Coffee', 'h1'),
          lexicalParagraph('Guides, tutorials and practical tips from the Black Oak roasting team.'),
        ),
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Shop Coffee',
              url: '/shop',
            },
          },
        ],
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              enableLink: false,
              richText: richTextFrom(
                lexicalParagraph(
                  'Browse coffee guides covering brew methods, extraction, equipment, storage and coffee origins.',
                ),
              ),
            },
          ],
        },
      ],
      meta: {
        title: 'Brew Guides | Black Oak Coffee Co.',
        description: 'Coffee brewing guides, tutorials and origin explainers from Black Oak Coffee Co.',
        image: homeImage,
      },
    },
  })

  for (const pageSeed of marketingPages) {
    await payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        ...seedContext,
      },
      data: {
        title: pageSeed.title,
        slug: pageSeed.slug,
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: richTextFrom(lexicalHeading(pageSeed.heroHeading, 'h1'), lexicalParagraph(pageSeed.heroText)),
          links: [
            {
              link: {
                type: 'custom',
                appearance: 'default',
                label: pageSeed.ctaLabel,
                url: pageSeed.ctaUrl,
              },
            },
          ],
        },
        layout: [
          {
            blockType: 'features',
            title: `${pageSeed.title} Highlights`,
            items: [
              {
                title: 'Quality First',
                description: richTextFrom(lexicalParagraph('Everything is planned to feel like a polished, real-world coffee business.')),
              },
              {
                title: 'Designed for Conversion',
                description: richTextFrom(lexicalParagraph('Each section is seeded to showcase ecommerce and booking journeys in one site.')),
              },
              {
                title: 'Easy to Replace',
                description: richTextFrom(lexicalParagraph('You can quickly swap text and media while keeping structure and relationships intact.')),
              },
            ],
          },
        ],
        meta: {
          title: `${pageSeed.title} | Black Oak Coffee Co.`,
          description: pageSeed.heroText,
          image: homeImage,
        },
      },
    })
  }

  for (const title of blogGuideTitles) {
    await payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        ...seedContext,
      },
      data: {
        title,
        slug: slugify(title),
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: richTextFrom(lexicalHeading(title, 'h1')),
          links: [
            {
              link: {
                type: 'custom',
                appearance: 'outline',
                label: 'Back to Blog',
                url: '/blog',
              },
            },
          ],
        },
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                enableLink: false,
                richText: richTextFrom(
                  lexicalParagraph(
                    `This guide gives practical, beginner-friendly advice for ${title.toLowerCase()}. Update this seeded article with your own expertise or brand voice as needed.`,
                  ),
                ),
              },
            ],
          },
        ],
        meta: {
          title: `${title} | Black Oak Coffee Co.`,
          description: `A practical guide from Black Oak Coffee Co: ${title}.`,
          image: homeImage,
        },
      },
    })
  }

  payload.logger.info(`— Seeding globals...`)

  const { defaultPalette } = await upsertThemePalettes(payload)

  // Header/footer primary links are derived from PROJECT_TYPE (see src/config/nav.ts).
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: { type: 'custom', label: 'About', url: '/about', newTab: false },
        },
        {
          link: { type: 'custom', label: 'Workshops', url: '/workshops', newTab: false },
        },
        {
          link: { type: 'custom', label: 'Blog', url: '/blog', newTab: false },
        },
        {
          link: { type: 'custom', label: 'Contact', url: '/contact', newTab: false },
        },
      ],
    } as Partial<Header>,
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: { navItems: [] } as Partial<Footer>,
  })
  await payload.updateGlobal({
    slug: 'site-theme',
    data: {
      paletteMode: 'palette',
      palette: defaultPalette?.id,
    } as Partial<SiteTheme>,
    context: {
      disableRevalidate: true,
    },
  })

  const shouldSeedEcommerce = mode === 'ecommerce' || mode === 'hybrid'
  const shouldSeedBooking = mode === 'booking' || mode === 'hybrid'

  if (shouldSeedEcommerce) {
    payload.logger.info(`— Seeding addresses...`)

    await payload.create({
      collection: 'addresses',
      depth: 0,
      data: {
        customer: customer.id,
        ...(baseAddressUKData as Address),
      },
    })

    payload.logger.info(`— Seeding transactions...`)

    const succeededTransaction = await payload.create({
      collection: 'transactions',
      data: {
        currency: 'GBP',
        customer: customer.id,
        paymentMethod: 'stripe',
        stripe: { customerID: 'cus_123', paymentIntentID: 'pi_123' },
        status: 'succeeded',
        billingAddress: baseAddressUKData,
      },
    })

    payload.logger.info(`— Seeding carts...`)

    await payload.create({
      collection: 'carts',
      data: {
        customer: customer.id,
        currency: 'GBP',
        purchasedAt: new Date().toISOString(),
        subtotal: firstProduct.priceInGBP,
        items: [{ product: firstProduct.id, quantity: 1 }],
      },
    })

    payload.logger.info(`— Seeding orders...`)

    await payload.create({
      collection: 'orders',
      context: seedContext,
      data: {
        amount: firstProduct.priceInGBP,
        currency: 'GBP',
        customer: customer.id,
        shippingAddress: baseAddressUKData,
        items: [{ product: firstProduct.id, quantity: 1 }],
        status: 'completed',
        transactions: [succeededTransaction.id],
      },
    })

    const additionalOrderProducts = products.slice(1, 4)
    for (const product of additionalOrderProducts) {
      await payload.create({
        collection: 'orders',
        context: seedContext,
        data: {
          amount: product.priceInGBP,
          currency: 'GBP',
          customer: customer.id,
          customerEmail: SEEDED_CONTACT_EMAIL,
          shippingAddress: baseAddressUKData,
          items: [{ product: product.id, quantity: 1 }],
          status: 'completed',
          transactions: [succeededTransaction.id],
        },
      })
    }
  }

  if (shouldSeedBooking) {
    payload.logger.info(`— Seeding demo services and bookings...`)

    const serviceDocs: Array<{ id: number; slug: string }> = []
    for (const [idx, serviceSeed] of serviceSeeds.entries()) {
      const linkedProduct = products[idx % products.length]
      const serviceImage = serviceSlugToMedia.get(serviceSeed.slug)
      payload.logger.info(`  · Creating service: ${serviceSeed.name}`)
      const serviceDoc = await payload.create({
        collection: 'services',
        data: {
          name: serviceSeed.name,
          slug: serviceSeed.slug,
          description: serviceSeed.description,
          durationMinutes: serviceSeed.durationMinutes,
          enabledPriceInGBP: true,
          priceInGBP: serviceSeed.priceInGBP,
          active: true,
          linkedProduct: linkedProduct?.id,
          image: serviceImage?.id,
        },
      })
      serviceDocs.push({ id: serviceDoc.id, slug: serviceSeed.slug })
    }

    const baseDate = new Date()
    const bookingTimes = ['10:00', '11:30', '14:00', '16:00', '17:30', '09:30', '13:00']

    for (const [idx, serviceDoc] of serviceDocs.entries()) {
      const slotDate = new Date(baseDate)
      slotDate.setDate(baseDate.getDate() + idx + 1)
      const linkedProduct = products[idx % products.length]
      await payload.create({
        collection: 'bookings',
        context: seedContext,
        data: {
          service: serviceDoc.id,
          product: linkedProduct?.id,
          customer: idx % 2 === 0 ? customer.id : undefined,
          guestEmail: SEEDED_CONTACT_EMAIL,
          guestName: idx % 2 === 0 ? 'Demo Customer' : `Workshop Guest ${idx + 1}`,
          slotDate: slotDate.toISOString().slice(0, 10),
          slotTime: bookingTimes[idx % bookingTimes.length],
          status: idx % 3 === 0 ? 'confirmed' : 'pending',
          notes: 'Seeded workshop booking for demo instance.',
        },
      })
    }
  }

  payload.logger.info('Seeded database successfully!')
}
