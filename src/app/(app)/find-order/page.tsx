import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { FindOrderForm } from '@/components/forms/FindOrderForm'
import { headers as getHeaders } from 'next/headers.js'
import { redirectIfEcommerceDisabled } from '@/utilities/requireEcommerce'
import { getCustomerAuthUser } from '@/utilities/getCustomerAuthUser'

export default async function FindOrderPage() {
  redirectIfEcommerceDisabled()
  const headers = await getHeaders()
  const user = await getCustomerAuthUser(headers)

  return (
    <div className="container py-16">
      <FindOrderForm initialEmail={user?.email} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Find your order using your email and order ID.',
  openGraph: mergeOpenGraph({
    title: 'Find order',
    url: '/find-order',
  }),
  title: 'Find order',
}
