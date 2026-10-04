'use client'

import Link from 'next/link'
import React from 'react'

import { setConsent, useConsent } from '@/utilities/consent'

/**
 * Opt-in: the layout only mounts this when NEXT_PUBLIC_COOKIE_CONSENT is set.
 * With no non-essential storage there is nothing to consent to, and a banner
 * would just be noise.
 */
export const CookieConsent: React.FC<{ policyHref?: string }> = ({
  policyHref = '/cookie-policy',
}) => {
  const consent = useConsent()

  // `undefined` on the server and the first client render, so the banner
  // never flashes in before we know whether a choice has already been made.
  if (consent !== null) return null

  return (
    <div
      role="region"
      aria-label="Cookie choices"
      className="bg-popover shadow-overlay fixed inset-x-3 bottom-3 z-50 rounded-xl p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md sm:p-5"
    >
      <p className="text-muted-foreground text-sm">
        We would like to use anonymous analytics to see which pages are useful. Nothing is used to
        identify you.{' '}
        <Link href={policyHref} className="text-primary font-medium underline">
          How we use cookies
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => setConsent('accepted')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2.5 text-sm font-semibold"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => setConsent('rejected')}
          className="bg-muted text-foreground hover:bg-secondary text-body-sm rounded-sm px-4 py-2.5 font-medium transition-colors"
        >
          Reject non-essential
        </button>
      </div>
    </div>
  )
}
