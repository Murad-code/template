import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { ConfirmBooking } from '@/components/BookingForm/ConfirmBooking'
import { getSiteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function ConfirmBookingPage() {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    redirect('/')
  }

  return (
    <div className="container min-h-[90vh] flex py-12">
      <Suspense
        fallback={
          <div className="text-center w-full flex flex-col items-center gap-4">
            <h1 className="text-2xl">Confirming booking</h1>
            <p className="text-muted-foreground text-sm">Loading…</p>
          </div>
        }
      >
        <ConfirmBooking />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Confirm your booking after payment.',
  openGraph: mergeOpenGraph({
    title: 'Confirming booking',
    url: '/book/confirm',
  }),
  title: 'Confirming booking',
}
