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
  const skeleton = 'w-full h-6 animate-pulse rounded bg-muted'

  const copyrightName = companyName || siteName || ''

  return (
    <footer className="bg-card text-sm text-muted-foreground">
      <div className="container">
        <div className="flex w-full flex-col gap-6 py-12 text-sm md:flex-row md:gap-12">
          <div>
            <Link className="flex items-center gap-2 text-foreground md:pt-1" href="/">
              <LogoIcon className="w-6" />
              <span className="sr-only">{siteName}</span>
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
          <div className="md:ml-auto flex flex-col gap-4 items-end">
            <ThemeSelector />
          </div>
        </div>
      </div>
      <div className="py-6 text-sm">
        <div className="container mx-auto flex w-full flex-col items-center gap-1 md:flex-row md:gap-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-muted md:inline-block" />
          <p>Designed in London</p>
        </div>
      </div>
    </footer>
  )
}
