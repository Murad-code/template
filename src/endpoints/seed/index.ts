import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'
import { discoverSeedDir } from './discover'
import { readLocalFile } from './localFile'
import { marqueeProductData, slugify } from './marquee-product'
import { Address, Transaction } from '@/payload-types'
import type { Header, Footer, Media, Product } from '@/payload-types'

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
  'bookings',
]

const globals: GlobalSlug[] = ['header', 'footer']

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

export type SeedMode = 'ecommerce' | 'booking'

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
  payload.logger.info(`Seeding database (mode: ${mode})...`)

  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: { navItems: [] } as Partial<Header> & Partial<Footer>,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
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
      email: { equals: 'customer@example.com' },
    },
  })

  payload.logger.info(`— Discovering seed content...`)

  const { productFolders, heroImagePath } = await discoverSeedDir()

  if (productFolders.length === 0) {
    throw new Error('Seed directory contains no product folders with images.')
  }

  payload.logger.info(`— Seeding media...`)

  const heroFile = heroImagePath ? await readLocalFile(heroImagePath) : null
  const heroMedia: Media | null = heroFile
    ? await payload.create({
        collection: 'media',
        data: { alt: 'Homepage hero' },
        file: heroFile,
      })
    : null

  const pathToMedia = new Map<string, Media>()
  for (const folder of productFolders) {
    for (const imagePath of folder.imagePaths) {
      if (pathToMedia.has(imagePath)) continue
      const file = await readLocalFile(imagePath)
      const doc = await payload.create({
        collection: 'media',
        data: { alt: `${folder.title} - ${file.name}` },
        file,
      })
      pathToMedia.set(imagePath, doc)
    }
  }

  payload.logger.info(`— Seeding category...`)

  const marqueesCategory = await payload.create({
    collection: 'categories',
    data: { title: 'Marquees', slug: 'marquees' },
  })

  payload.logger.info(`— Seeding products...`)

  const MARQUEE_PRICE = 50000 // £500
  const products: Product[] = []

  for (const folder of productFolders) {
    const galleryMedia = folder.imagePaths
      .map((p) => pathToMedia.get(p))
      .filter((m): m is Media => m != null)
    if (galleryMedia.length === 0) continue

    const firstImage = galleryMedia[0]
    const slug = slugify(folder.title)
    const data = marqueeProductData({
      title: folder.title,
      slug,
      gallery: galleryMedia.map((image) => ({ image })),
      metaImage: firstImage,
      category: marqueesCategory,
      priceInGBP: MARQUEE_PRICE,
    })

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
      email: 'customer@example.com',
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

  const fallbackImage = pathToMedia.get(productFolders[0].imagePaths[0])
  const homeImage = heroMedia ?? fallbackImage ?? null
  if (!homeImage) throw new Error('No images available for homepage.')
  await payload.create({
    collection: 'pages',
    depth: 0,
    data: homePageData({
      contentImage: homeImage,
      metaImage: homeImage,
    }),
  })
  await payload.create({
    collection: 'pages',
    depth: 0,
    data: contactPageData({ contactForm }),
  })

  payload.logger.info(`— Seeding globals...`)

  const headerNav = [
    { link: { type: 'custom' as const, label: 'Home', url: '/' } },
    { link: { type: 'custom' as const, label: 'Products', url: '/shop' } },
    { link: { type: 'custom' as const, label: 'Account', url: '/account' } },
  ]
  const footerNav = [
    { link: { type: 'custom' as const, label: 'Admin', url: '/admin' } },
    { link: { type: 'custom' as const, label: 'Find my order', url: '/find-order' } },
    { link: { type: 'custom' as const, label: 'Payload', newTab: true, url: 'https://payloadcms.com/' } },
  ]
  await payload.updateGlobal({
    slug: 'header',
    data: { navItems: headerNav } as Partial<Header>,
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: { navItems: footerNav } as Partial<Footer>,
  })

  if (mode === 'ecommerce') {
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
        subtotal: MARQUEE_PRICE,
        items: [{ product: firstProduct.id, quantity: 1 }],
      },
    })

    payload.logger.info(`— Seeding orders...`)

    await payload.create({
      collection: 'orders',
      data: {
        amount: MARQUEE_PRICE,
        currency: 'GBP',
        customer: customer.id,
        shippingAddress: baseAddressUKData,
        items: [{ product: firstProduct.id, quantity: 1 }],
        status: 'completed',
        transactions: [succeededTransaction.id],
      },
    })
  }

  if (mode === 'booking') {
    payload.logger.info(`— Seeding demo bookings...`)

    const productA = firstProduct
    const productB = products[1]

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)

    await payload.create({
      collection: 'bookings',
      data: {
        product: productA.id,
        guestEmail: 'customer@example.com',
        guestName: 'Demo Customer',
        slotDate: tomorrow.toISOString().slice(0, 10),
        slotTime: '10:00',
        status: 'confirmed',
      },
    })

    if (productB) {
      await payload.create({
        collection: 'bookings',
        data: {
          product: productB.id,
          guestEmail: 'guest@example.com',
          guestName: 'Guest User',
          slotDate: dayAfter.toISOString().slice(0, 10),
          slotTime: '14:00',
          status: 'pending',
        },
      })
    }
  }

  payload.logger.info('Seeded database successfully!')
}
