'use client'

import { useAuth } from '@payloadcms/ui'
import React from 'react'

import { SeedButton } from './SeedButton'

const baseClass = 'before-dashboard'

export const RootOnlyActions: React.FC = () => {
  const { user } = useAuth()
  const isRoot = Boolean(user?.roles?.includes('root'))

  if (!isRoot) return null

  return (
    <>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <SeedButton />
        <li>
          {'Connect Stripe in your environment variables, then restart your server to enable checkout and booking payments.'}
        </li>
        <li>
          {'Review products, services, pages and navigation to tailor this demo for your client brand and offer.'}
        </li>
      </ul>
      {'Tip: This welcome block is fully customizable and can be removed from your admin config at any time.'}
    </>
  )
}
