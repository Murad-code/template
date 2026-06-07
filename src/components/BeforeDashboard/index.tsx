import { Banner } from '@payloadcms/ui'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

export const BeforeDashboard: React.FC = () => {
  const companyName = process.env.COMPANY_NAME || process.env.SITE_NAME || 'Your Company'

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to {companyName} admin!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' with a few products and pages to jump-start your new project, then '}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">visit your website</a>
          {' to see the results.'}
        </li>
        <li>
          {'Connect Stripe in your environment variables, then restart your server to enable checkout and booking payments.'}
        </li>
        <li>
          {'Review products, services, pages and navigation to tailor this demo for your client brand and offer.'}
        </li>
      </ul>
      {'Tip: This welcome block is fully customizable and can be removed from your admin config at any time.'}
    </div>
  )
}
