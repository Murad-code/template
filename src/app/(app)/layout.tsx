import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ensureStartsWith } from '@/utilities/ensureStartsWith'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getSiteConfig } from '@/config/site'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import React from 'react'
import './globals.css'

export async function generateMetadata() {
  const { siteName, serverURL, twitterCreator: rawCreator, twitterSite: rawSite } = getSiteConfig()
  const twitterCreator = rawCreator ? ensureStartsWith(rawCreator, '@') : undefined
  const twitterSite = rawSite ? ensureStartsWith(rawSite, 'https://') : undefined

  return {
    metadataBase: new URL(serverURL),
    robots: {
      follow: true,
      index: true,
    },
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    ...(twitterCreator &&
      twitterSite && {
        twitter: {
          card: 'summary_large_image' as const,
          creator: twitterCreator,
          site: twitterSite,
        },
      }),
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
