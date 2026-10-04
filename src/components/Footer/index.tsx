import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { LogoIcon } from '@/components/icons/logo'
import { getSiteConfig } from '@/config/site'
import { getEffectiveFooterNavItems } from '@/config/nav'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { Suspense } from 'react'

export async function Footer() {
  const config = getSiteConfig()
  const { companyName, siteName } = config
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = getEffectiveFooterNavItems(footer, config)
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const skeleton = 'h-5 w-full animate-pulse rounded-xs bg-muted'

  const copyrightName = companyName || siteName || ''

  return (
    <footer className="bg-surface-footer mt-24">
      <div className="container">
        <div className="flex w-full flex-col gap-10 py-14 md:flex-row md:gap-16">
          <div>
            <Link
              className="text-foreground interactive-focus inline-flex items-center gap-2.5 rounded-xs"
              href="/"
            >
              <LogoIcon className="w-6" />
              <span className="text-body font-medium">{siteName}</span>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
          <div className="flex flex-col items-start gap-4 md:ml-auto md:items-end">
            <ThemeSelector />
          </div>
        </div>
      </div>
      <div className="pb-10">
        <div className="text-body-sm text-muted-foreground container flex w-full flex-col items-center gap-1 md:flex-row md:gap-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <span
            aria-hidden="true"
            className="bg-border-strong mx-4 hidden h-3 w-px md:inline-block"
          />
          <p>Designed in London</p>
        </div>
      </div>
    </footer>
  )
}
