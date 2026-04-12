import { createHmac } from 'crypto'

const SECRET = process.env.PAYLOAD_SECRET || ''

/**
 * Create a signed token for the booking cancel link.
 * Token format: base64url(bookingId).signature
 */
export function createBookingCancelToken(bookingId: number): string {
  const payload = Buffer.from(String(bookingId), 'utf8').toString('base64url')
  const signature = createHmac('sha256', SECRET).update(String(bookingId)).digest('base64url')
  return `${payload}.${signature}`
}

/**
 * Verify token and return booking id, or null if invalid.
 */
export function verifyBookingCancelToken(token: string): number | null {
  if (!token || !SECRET) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  let bookingIdStr: string
  try {
    bookingIdStr = Buffer.from(payload, 'base64url').toString('utf8')
  } catch {
    return null
  }
  const expected = createHmac('sha256', SECRET).update(bookingIdStr).digest('base64url')
  if (signature !== expected) return null
  const id = parseInt(bookingIdStr, 10)
  return Number.isFinite(id) ? id : null
}
