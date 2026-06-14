import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Order } from '@/payload-types'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { SurfaceCard } from '@/components/ui/surface-card'
import { getCustomerAuthUser } from '@/utilities/getCustomerAuthUser'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'

export default async function AddressesPage() {
  const headers = await getHeaders()
  const user = await getCustomerAuthUser(headers)
  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  const payload = await getPayload({ config: configPromise })

  let orders: Order[] | null = null

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  return (
    <>
      <SurfaceCard className="gap-6 rounded-lg border-0 p-8 shadow-sm shadow-black/10 dark:shadow-black/40">
        <h1 className="text-3xl font-medium mb-8">Addresses</h1>

        <div className="mb-8">
          <AddressListing />
        </div>

        <CreateAddressModal />
      </SurfaceCard>
    </>
  )
}

export const metadata: Metadata = {
  description: 'Manage your addresses.',
  openGraph: mergeOpenGraph({
    title: 'Addresses',
    url: '/account/addresses',
  }),
  title: 'Addresses',
}
