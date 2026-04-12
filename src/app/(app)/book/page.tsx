import { BookingForm } from '@/components/BookingForm'
import { getSiteConfig } from '@/config/site'
import { redirect } from 'next/navigation'

export default async function BookPage() {
  const { bookingEnabled } = getSiteConfig()
  if (!bookingEnabled) {
    redirect('/')
  }
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-medium mb-8">Book a slot</h1>
      <p className="text-muted-foreground mb-8">Pick a service, then a date and time</p>
      <BookingForm />
    </div>
  )
}
