/**
 * Central site/project config read from environment.
 * Use this instead of process.env directly for branding, URLs, and feature flags.
 */

export type ProjectType = 'ecommerce' | 'booking' | 'hybrid'

export interface SiteConfig {
  siteName: string
  companyName: string
  serverURL: string
  projectType: ProjectType
  enableBooking: boolean
  enableInvoices: boolean
  twitterCreator?: string
  twitterSite?: string
}

function parseProjectType(value: string | undefined): ProjectType {
  const v = (value || 'ecommerce').toLowerCase()
  if (v === 'booking' || v === 'hybrid') return v
  return 'ecommerce'
}

export function getSiteConfig(): SiteConfig {
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')

  const twitterCreator = process.env.TWITTER_CREATOR
  const twitterSite = process.env.TWITTER_SITE

  return {
    siteName: process.env.SITE_NAME || 'Payload Commerce',
    companyName: process.env.COMPANY_NAME || process.env.SITE_NAME || '',
    serverURL,
    projectType: parseProjectType(process.env.PROJECT_TYPE),
    enableBooking: process.env.ENABLE_BOOKING === 'true',
    enableInvoices: process.env.ENABLE_INVOICES !== 'false',
    twitterCreator: twitterCreator || undefined,
    twitterSite: twitterSite || undefined,
  }
}
