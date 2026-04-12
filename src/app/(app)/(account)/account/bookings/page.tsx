import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

import { getSiteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { MyBookingsList } from './MyBookingsList'

export default async function MyBookingsPage() {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    redirect('/account')
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent('Please log in to view your bookings.')}`)
  }

  let bookings: Array<{
    id: number
    slotDate: string
    slotTime: string
    status: string
    service?: { name?: string } | number
  }> = []

  try {
    const result = await payload.find({
      collection: 'bookings',
      where: { customer: { equals: user.id } },
      depth: 1,
      sort: '-slotDate',
      limit: 100,
      user,
      overrideAccess: false,
    })
    bookings = result.docs as typeof bookings
  } catch {
    bookings = []
  }

  return (
    <div>
      <h1 className="text-3xl font-medium mb-2">My bookings</h1>
      <p className="text-muted-foreground mb-8">Bookings linked to your account.</p>
      <MyBookingsList bookings={bookings} />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteName } = getSiteConfig()
  const title = `Bookings — ${siteName}`
  return {
    title,
    description: 'Your upcoming and past bookings.',
    openGraph: mergeOpenGraph({ title, url: '/account/bookings' }),
  }
}
