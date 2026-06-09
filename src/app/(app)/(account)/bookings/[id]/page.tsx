import type { Booking, Service } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatDateDisplayDMY, toDateOnlyString } from '@/utilities/dateOnly'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getSiteConfig } from '@/config/site'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

export default async function BookingInvoicePage({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const { enableInvoices } = getSiteConfig()

  const { id } = await params
  const { email = '', accessToken = '' } = await searchParams

  let booking: Booking | null = null

  try {
    const {
      docs: [bookingResult],
    } = await payload.find({
      collection: 'bookings',
      user,
      overrideAccess: !Boolean(user),
      depth: 1,
      where: {
        and: [
          { id: { equals: id } },
          ...(user
            ? [{ customer: { equals: user.id } }]
            : [
                { accessToken: { equals: accessToken } },
                ...(email
                  ? [
                      {
                        guestEmail: {
                          equals: email,
                        },
                      },
                    ]
                  : []),
              ]),
        ],
      },
      select: {
        id: true,
        service: true,
        guestEmail: true,
        guestName: true,
        slotDate: true,
        slotTime: true,
        status: true,
        amount: true,
        currency: true,
        stripePaymentIntentId: true,
        createdAt: true,
        customer: true,
        accessToken: true,
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      bookingResult &&
      bookingResult.guestEmail &&
      bookingResult.guestEmail === email
    const canAccessAsUser =
      user &&
      bookingResult &&
      bookingResult.customer &&
      (typeof bookingResult.customer === 'object'
        ? bookingResult.customer.id
        : bookingResult.customer) === user.id

    if (bookingResult && (canAccessAsGuest || canAccessAsUser)) {
      booking = bookingResult as Booking
    }
  } catch (error) {
    console.error(error)
  }

  if (!booking) {
    notFound()
  }

  const service =
    booking.service && typeof booking.service === 'object' ? (booking.service as Service) : null

  const invoicePdfHref =
    enableInvoices && booking.amount != null && booking.amount > 0
      ? user
        ? `/api/invoices/bookings/${booking.id}`
        : accessToken && email
          ? `/api/invoices/bookings/${booking.id}?accessToken=${encodeURIComponent(accessToken)}&email=${encodeURIComponent(email)}`
          : null
      : null

  return (
    <div className="">
      <div className="flex gap-8 justify-between items-center mb-6">
        {user ? (
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/account/bookings">
                <ChevronLeftIcon />
                My bookings
              </Link>
            </Button>
          </div>
        ) : (
          <div />
        )}

        <h1 className="text-sm uppercase font-mono px-2 bg-primary/10 rounded tracking-[0.07em]">
          <span>{`Booking #${booking.id}`}</span>
        </h1>
      </div>

      <div className="bg-card rounded-lg px-6 py-4 flex flex-col gap-12 shadow-sm shadow-black/10 dark:shadow-black/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div>
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Booked on</p>
            <p className="text-lg">
              <time dateTime={booking.createdAt}>
                {formatDateTime({ date: booking.createdAt })}
              </time>
            </p>
          </div>

          <div>
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Appointment</p>
            <p className="text-lg">
              <time dateTime={toDateOnlyString(booking.slotDate)}>
                {formatDateDisplayDMY(booking.slotDate)}
              </time>{' '}
              at {booking.slotTime}
            </p>
          </div>

          {booking.amount != null && booking.amount > 0 ? (
            <div>
              <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Total paid</p>
              <Price className="text-lg" amount={booking.amount} />
            </div>
          ) : (
            <div>
              <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Payment</p>
              <p className="text-lg text-muted-foreground">No charge</p>
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

        {service && (
          <div>
            <h2 className="font-mono text-primary/50 mb-2 uppercase text-sm">Service</h2>
            <p className="text-lg font-medium">{service.name}</p>
            {service.description ? (
              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
            ) : null}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:gap-12 gap-4">
          <div>
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Status</p>
            <p className="text-lg capitalize">{booking.status}</p>
          </div>
          {booking.stripePaymentIntentId ? (
            <div>
              <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Payment</p>
              <p className="text-sm text-muted-foreground">Received via card</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Booking details for booking ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Booking ${id}`,
      url: `/bookings/${id}`,
    }),
    title: `Booking ${id}`,
  }
}
