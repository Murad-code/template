/**
 * Central site/project config read from environment.
 * Use this instead of process.env directly for branding, URLs, and feature flags.
 */

export type ProjectType = 'ecommerce' | 'booking' | 'hybrid'

export interface SiteConfig {
  siteName: string
  companyName: string
  /** Optional address lines for invoices (e.g. "123 Main St", "City, Country") */
  companyAddress?: string
  /** Company phone for invoices (UK Gov requirement: contact information) */
  companyPhone?: string
  /** Company email for invoices (UK Gov requirement: contact information) */
  companyEmail?: string
  /** VAT registration number; if set, invoice will show VAT number and VAT row when vatRatePercent is set */
  companyVatNumber?: string
  /** VAT rate as percentage (e.g. 20). If set with companyVatNumber, invoice shows VAT amount. */
  vatRatePercent?: number
  /** Sole trader: legal name (your name) for invoices */
  soleTraderLegalName?: string
  /** Sole trader: address for legal documents when using a business name */
  soleTraderLegalAddress?: string
  serverURL: string
  projectType: ProjectType
  enableBooking: boolean
  /** True when booking is enabled via ENABLE_BOOKING or PROJECT_TYPE=booking|hybrid */
  bookingEnabled: boolean
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

  const vatRate = process.env.VAT_RATE_PERCENT
  return {
    siteName: process.env.SITE_NAME || 'Payload Commerce',
    companyName: process.env.COMPANY_NAME || process.env.SITE_NAME || '',
    companyAddress: process.env.COMPANY_ADDRESS || undefined,
    companyPhone: process.env.COMPANY_PHONE || undefined,
    companyEmail: process.env.COMPANY_EMAIL || undefined,
    companyVatNumber: process.env.COMPANY_VAT_NUMBER || undefined,
    vatRatePercent: vatRate !== undefined && vatRate !== '' ? Number(vatRate) : undefined,
    soleTraderLegalName: process.env.SOLE_TRADER_LEGAL_NAME || undefined,
    soleTraderLegalAddress: process.env.SOLE_TRADER_LEGAL_ADDRESS || undefined,
    serverURL,
    projectType: parseProjectType(process.env.PROJECT_TYPE),
    enableBooking: process.env.ENABLE_BOOKING === 'true',
    bookingEnabled:
      process.env.ENABLE_BOOKING === 'true' ||
      ['booking', 'hybrid'].includes(parseProjectType(process.env.PROJECT_TYPE)),
    enableInvoices: process.env.ENABLE_INVOICES !== 'false',
    twitterCreator: twitterCreator || undefined,
    twitterSite: twitterSite || undefined,
  }
}
