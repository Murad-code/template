import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ensureStartsWith } from '@/utilities/ensureStartsWith'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getSiteConfig } from '@/config/site'
import { ThemeStyles } from '@/components/ThemeStyles'
import { ThemePreviewLiveSync } from '@/components/ThemePreviewLiveSync'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import {
  DM_Serif_Display,
  Fira_Code,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Lora,
  Merriweather,
  Montserrat,
  Nunito_Sans,
  Playfair_Display,
  Roboto_Mono,
  Source_Code_Pro,
  Source_Sans_3,
  Space_Grotesk,
} from 'next/font/google'
import React from 'react'
import './globals.css'

const InterFont = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: false })
const SourceSans3Font = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-3',
  display: 'swap',
  preload: false,
})
const NunitoSansFont = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
  preload: false,
})
const MontserratFont = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
})
const SpaceGroteskFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: false,
})
const PlayfairDisplayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
  preload: false,
})
const LoraFont = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap', preload: false })
const MerriweatherFont = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
  preload: false,
})
const DMSerifDisplayFont = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif-display',
  display: 'swap',
  preload: false,
})
const JetBrainsMonoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
})
const FiraCodeFont = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
  preload: false,
})
const IBMPlexMonoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  preload: false,
})
const SourceCodeProFont = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
  preload: false,
})
const RobotoMonoFont = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
  preload: false,
})

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
      className={[
        GeistSans.variable,
        GeistMono.variable,
        InterFont.variable,
        SourceSans3Font.variable,
        NunitoSansFont.variable,
        MontserratFont.variable,
        SpaceGroteskFont.variable,
        PlayfairDisplayFont.variable,
        LoraFont.variable,
        MerriweatherFont.variable,
        DMSerifDisplayFont.variable,
        JetBrainsMonoFont.variable,
        FiraCodeFont.variable,
        IBMPlexMonoFont.variable,
        SourceCodeProFont.variable,
        RobotoMonoFont.variable,
      ]
        .filter(Boolean)
        .join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <ThemeStyles />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />
          <ThemePreviewLiveSync />

          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
