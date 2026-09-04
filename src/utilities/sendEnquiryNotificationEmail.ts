import type { Payload } from 'payload'

import { getSiteConfig } from '@/config/site'
import { getEnquiryRecipient } from '@/utilities/getEnquiryRecipient'
import { getServerSideURL } from '@/utilities/getURL'
import type { EnquiryFieldValues } from '@/utilities/validateEnquiryFields'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, '<br />')
}

export async function sendEnquiryNotificationEmail({
  payload,
  submissionId,
  fields,
}: {
  payload: Payload
  submissionId?: number | string
  fields: EnquiryFieldValues
}): Promise<void> {
  if (!payload.config.email) {
    payload.logger.warn({
      msg: 'Enquiry notification skipped: no email adapter configured (set RESEND_API_KEY or SMTP_*)',
      submissionId,
    })
    return
  }

  const to = await getEnquiryRecipient(payload)
  if (!to) {
    payload.logger.warn({
      msg: 'Enquiry notification skipped: set Site settings enquiry recipient, COMPANY_EMAIL, ADMIN_EMAIL, or SMTP_FROM_EMAIL',
      submissionId,
    })
    return
  }

  const name = fields.name?.trim() || 'Visitor'
  const email = fields.email?.trim() || ''
  const phone = fields.phone?.trim() || ''
  const message = fields.message?.trim() || ''
  const { siteName } = getSiteConfig()
  const serverURL = getServerSideURL()
  const adminHref = submissionId
    ? `${serverURL}/admin/collections/form-submissions/${submissionId}`
    : `${serverURL}/admin/collections/form-submissions`

  await payload.sendEmail({
    to,
    ...(email ? { replyTo: email } : {}),
    subject: `[${siteName}] New enquiry from ${name}`,
    html: `
      <p>A new enquiry was submitted on <strong>${escapeHtml(siteName)}</strong>.</p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email || '—')}</li>
        <li><strong>Phone:</strong> ${escapeHtml(phone || '—')}</li>
      </ul>
      <p><strong>Message</strong></p>
      <p>${nl2br(message || '—')}</p>
      <p><a href="${escapeHtml(adminHref)}">Open submission in admin</a></p>
    `.trim(),
  })
}
