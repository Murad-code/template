import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getSiteConfig } from '@/config/site'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ProductItem } from '@/components/ProductItem'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { OrderStatus } from '@/components/OrderStatus'
import { AddressItem } from '@/components/addresses/AddressItem'
import { AccountDetailMetaLabel, AccountDetailPanel } from '@/components/account/AccountDetailPanel'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

export default async function Order({ params, searchParams }: PageProps) {
  const { ecommerceEnabled, bookingEnabled, enableInvoices } = getSiteConfig()
  if (!ecommerceEnabled) {
    redirect(bookingEnabled ? '/account/bookings' : '/account')
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const { email = '', accessToken = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 2,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
                {
                  customer: {
                    equals: user.id,
                  },
                },
              ]
            : [
                {
                  accessToken: {
                    equals: accessToken,
                  },
                },
                ...(email
                  ? [
                      {
                        customerEmail: {
                          equals: email,
                        },
                      },
                    ]
                  : []),
              ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer.id
        : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  const invoicePdfHref =
    enableInvoices && order.amount != null && order.amount > 0
      ? user
        ? `/api/invoices/${order.id}`
        : accessToken && email
          ? `/api/invoices/${order.id}?accessToken=${encodeURIComponent(accessToken)}&email=${encodeURIComponent(email)}`
          : null
      : null

  return (
    <AccountDetailPanel
      backHref={user ? '/orders' : undefined}
      backLabel={user ? 'All orders' : undefined}
      badgeLabel={`Order #${order.id}`}
    >
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="">
            <AccountDetailMetaLabel>Order Date</AccountDetailMetaLabel>
            <p className="text-lg">
              <time dateTime={order.createdAt}>
                {formatDateTime({ date: order.createdAt })}
              </time>
            </p>
          </div>

          <div className="">
            <AccountDetailMetaLabel>Total</AccountDetailMetaLabel>
            {order.amount && <Price className="text-lg" amount={order.amount} />}
          </div>

          {order.status && (
            <div className="grow max-w-1/3">
              <AccountDetailMetaLabel>Status</AccountDetailMetaLabel>
              <OrderStatus className="text-sm" status={order.status} />
            </div>
          )}
        </div>

        {invoicePdfHref ? (
          <div>
            <Button asChild variant="outline" className="w-fit">
              <a href={invoicePdfHref}>Download PDF invoice</a>
            </Button>
          </div>
        ) : null}

        {order.items && (
          <div>
            <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">Items</h2>
            <ul className="flex flex-col gap-6">
              {order.items?.map((item, index) => {
                if (typeof item.product === 'string') {
                  return null
                }

                if (!item.product || typeof item.product !== 'object') {
                  return <div key={index}>This item is no longer available.</div>
                }

                const variant =
                  item.variant && typeof item.variant === 'object' ? item.variant : undefined

                return (
                  <li key={item.id}>
                    <ProductItem
                      product={item.product}
                      quantity={item.quantity}
                      variant={variant}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {order.shippingAddress && (
          <div>
            <h2 className="mb-4 font-mono text-sm uppercase text-muted-foreground">
              Shipping Address
            </h2>

            {/* @ts-expect-error - some kind of type hell */}
            <AddressItem address={order.shippingAddress} hideActions />
          </div>
        )}
    </AccountDetailPanel>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
    title: `Order ${id}`,
  }
}
