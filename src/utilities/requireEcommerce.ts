import { redirect } from 'next/navigation'

import { getSiteConfig } from '@/config/site'

/** Call from server layouts/pages when the route is ecommerce-only. */
export function redirectIfEcommerceDisabled(): void {
  const { ecommerceEnabled, bookingEnabled } = getSiteConfig()
  if (!ecommerceEnabled) {
    redirect(bookingEnabled ? '/book' : '/')
  }
}
