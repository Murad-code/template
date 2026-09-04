export const ENQUIRY_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ENQUIRY_NAME_MIN = 2
export const ENQUIRY_MESSAGE_MIN = 10
export const ENQUIRY_MESSAGE_MAX = 5000
export const ENQUIRY_PHONE_MIN_DIGITS = 7

export type EnquiryFieldValues = {
  name?: string
  email?: string
  phone?: string
  message?: string
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function countPhoneDigits(phone: string): number {
  return (phone.match(/\d/g) || []).length
}

export function isValidEnquiryEmail(email: string): boolean {
  return ENQUIRY_EMAIL_PATTERN.test(email)
}

export function isValidEnquiryPhone(phone: string): boolean {
  if (!phone) return false
  if (!/^[+()\d\s.-]+$/.test(phone)) return false
  return countPhoneDigits(phone) >= ENQUIRY_PHONE_MIN_DIGITS
}

/** Returns an error message, or null if valid. */
export function validateEnquiryName(value: unknown): string | null {
  const name = asTrimmedString(value)
  if (name.length < ENQUIRY_NAME_MIN) return 'Name must be at least 2 characters.'
  return null
}

export function validateEnquiryEmail(value: unknown): string | null {
  const email = asTrimmedString(value)
  if (!email) return 'Email is required.'
  if (!isValidEnquiryEmail(email)) return 'Enter a valid email address.'
  return null
}

export function validateEnquiryPhone(value: unknown): string | null {
  const phone = asTrimmedString(value)
  if (!phone) return 'Phone is required.'
  if (!isValidEnquiryPhone(phone)) {
    return 'Enter a valid phone number (at least 7 digits).'
  }
  return null
}

export function validateEnquiryMessage(value: unknown): string | null {
  const message = asTrimmedString(value)
  if (message.length < ENQUIRY_MESSAGE_MIN) {
    return `Message must be at least ${ENQUIRY_MESSAGE_MIN} characters.`
  }
  if (message.length > ENQUIRY_MESSAGE_MAX) {
    return `Message must be at most ${ENQUIRY_MESSAGE_MAX} characters.`
  }
  return null
}

export function parseEnquiryFields(
  submissionData: { field?: string; value?: string }[] | null | undefined,
): EnquiryFieldValues {
  const values: EnquiryFieldValues = {}
  for (const row of submissionData || []) {
    if (!row?.field) continue
    if (row.field === 'name' || row.field === 'email' || row.field === 'phone' || row.field === 'message') {
      values[row.field] = typeof row.value === 'string' ? row.value : String(row.value ?? '')
    }
  }
  return values
}

export function formHasEnquiryFields(fields: unknown): boolean {
  if (!Array.isArray(fields)) return false
  const names = new Set(
    fields.flatMap((field) => {
      if (!field || typeof field !== 'object' || !('name' in field)) return []
      const name = (field as { name?: unknown }).name
      return typeof name === 'string' && name ? [name] : []
    }),
  )
  return names.has('name') && names.has('email') && names.has('phone') && names.has('message')
}

/** Returns the first validation error, or null if all enquiry fields are valid. */
export function validateEnquiryFields(values: EnquiryFieldValues): string | null {
  return (
    validateEnquiryName(values.name) ||
    validateEnquiryEmail(values.email) ||
    validateEnquiryPhone(values.phone) ||
    validateEnquiryMessage(values.message)
  )
}
