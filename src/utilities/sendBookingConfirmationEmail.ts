import type { Payload } from 'payload'

import { getSiteConfig } from '@/config/site'
import { formatDateDisplayDMY } from '@/utilities/dateOnly'

type BookingForEmail = {
  id: number
  guestEmail: string
  guestName?: string | null
  slotDate: string
  slotTime: string
  status: string
  accessToken?: string | null
  service?: { name?: string | null } | number | null
}

function serviceLabel(booking: BookingForEmail): string {
  const s = booking.service
  if (s && typeof s === 'object' && s.name) return s.name
  return 'Your appointment'
}

/**
 * Sends booking confirmation with optional cancel link (token is opaque, signed with PAYLOAD_SECRET).
 */
export async function sendBookingConfirmationEmail({
  payload,
  booking,
  cancelToken,
}: {
  payload: Payload
  booking: BookingForEmail
  cancelToken: string
}): Promise<void> {
  if (!payload.config.email) {
    payload.logger.warn({ msg: 'Booking confirmation email skipped: no email adapter', bookingId: booking.id })
    return
  }

  const { siteName, serverURL } = getSiteConfig()
  const base = serverURL.replace(/\/$/, '')
  const cancelUrl = `${base}/bookings/cancel?token=${encodeURIComponent(cancelToken)}`
  const label = serviceLabel(booking)

  const viewParams = new URLSearchParams()
  viewParams.set('email', booking.guestEmail)
  if (booking.accessToken) viewParams.set('accessToken', booking.accessToken)
  const viewUrl =
    booking.accessToken != null && booking.accessToken !== ''
      ? `${base}/bookings/${booking.id}?${viewParams.toString()}`
      : null

  const html = `
    <h1>Booking received</h1>
    <p>Hi${booking.guestName ? ` ${escapeHtml(booking.guestName)}` : ''},</p>
    <p>Your booking for <strong>${escapeHtml(label)}</strong> is recorded as <strong>${escapeHtml(booking.status)}</strong>.</p>
    <p><strong>Date:</strong> ${escapeHtml(formatDateDisplayDMY(booking.slotDate))}<br/>
    <strong>Time:</strong> ${escapeHtml(booking.slotTime)}</p>
    ${viewUrl ? `<p><a href="${escapeHtmlAttr(viewUrl)}">View booking details</a></p>` : ''}
    <p>If you need to cancel, use this link (no login required):<br/>
    <a href="${escapeHtmlAttr(cancelUrl)}">Cancel booking</a></p>
    <p>— ${escapeHtml(siteName)}</p>
  `

  await payload.sendEmail({
    to: booking.guestEmail,
    subject: `Booking confirmation – ${label} – ${siteName}`,
    html,
  })

  payload.logger.info({ msg: 'Booking confirmation email sent', bookingId: booking.id })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeHtmlAttr(s: string): string {
  return escapeHtml(s)
}
