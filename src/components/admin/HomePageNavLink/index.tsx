import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

/**
 * Shortcut to the home page document, pinned above the collection list.
 *
 * The home page is an ordinary Pages document, not a global: it keeps the
 * same blocks, drafts and preview as every other page. Almost every site has
 * one and it is edited far more often than anything else, so hunting for it
 * in the Pages list every time is friction worth removing.
 *
 * Falls back to the filtered Pages list when no `home` page exists yet, so a
 * fresh database still gets a useful link rather than a dead one.
 */
export default async function HomePageNavLink() {
  const payload = await getPayload({ config })

  let href = '/admin/collections/pages?where[slug][equals]=home'

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      pagination: false,
      select: { slug: true },
      where: { slug: { equals: 'home' } },
    })

    const home = docs[0]
    if (home) href = `/admin/collections/pages/${home.id}`
  } catch {
    // A database that has not been migrated yet should not break the nav.
  }

  return (
    <Link className="nav__link" href={href} prefetch={false} style={{ padding: '0.5rem 0' }}>
      Home page
    </Link>
  )
}
