import type { Payload } from 'payload'

export type EnquiryRecipientSettings = {
  enquiryRecipientSource?: 'customEmail' | 'adminUser' | null
  enquiryEmail?: string | null
  enquiryAdminUser?: { email?: string | null } | number | null
}

export function resolveEnquiryRecipientFromSettings(
  settings: EnquiryRecipientSettings | null | undefined,
  env: {
    companyEmail?: string
    adminEmail?: string
    smtpFromEmail?: string
  } = {},
): string | undefined {
  const source = settings?.enquiryRecipientSource
  if (source === 'adminUser') {
    const user = settings?.enquiryAdminUser
    if (user && typeof user === 'object' && typeof user.email === 'string' && user.email.trim()) {
      return user.email.trim()
    }
  }

  const custom = settings?.enquiryEmail?.trim()
  if (custom) return custom

  const company = env.companyEmail?.trim()
  if (company) return company

  const admin = env.adminEmail?.trim()
  if (admin) return admin

  const from = env.smtpFromEmail?.trim()
  if (from) return from

  return undefined
}

export function envEnquiryFallbacks(): {
  companyEmail?: string
  adminEmail?: string
  smtpFromEmail?: string
} {
  return {
    companyEmail: process.env.COMPANY_EMAIL,
    adminEmail: process.env.ADMIN_EMAIL,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
  }
}

export function getDefaultSiteSettingsData() {
  const email =
    process.env.COMPANY_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.SMTP_FROM_EMAIL?.trim() ||
    undefined

  return {
    publicEmail: email,
    publicPhone: process.env.COMPANY_PHONE?.trim() || undefined,
    publicAddress: process.env.COMPANY_ADDRESS?.trim() || undefined,
    enquiryRecipientSource: 'customEmail' as const,
    enquiryEmail: email,
  }
}

export async function getEnquiryRecipient(payload: Payload): Promise<string | undefined> {
  const settings = (await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })) as EnquiryRecipientSettings

  const fromSettings = resolveEnquiryRecipientFromSettings(settings, envEnquiryFallbacks())
  if (fromSettings) return fromSettings

  const user = settings?.enquiryAdminUser
  if (settings?.enquiryRecipientSource === 'adminUser' && typeof user === 'number') {
    try {
      const doc = await payload.findByID({
        collection: 'users',
        id: user,
        depth: 0,
      })
      if (doc?.email?.trim()) return doc.email.trim()
    } catch {
      // Fall through to env defaults already applied above.
    }
  }

  return resolveEnquiryRecipientFromSettings(null, envEnquiryFallbacks())
}
