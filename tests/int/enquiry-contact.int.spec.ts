import { describe, expect, it } from 'vitest'

import { resolveEnquiryRecipientFromSettings } from '@/utilities/getEnquiryRecipient'
import {
  formHasEnquiryFields,
  parseEnquiryFields,
  validateEnquiryEmail,
  validateEnquiryFields,
  validateEnquiryMessage,
  validateEnquiryName,
  validateEnquiryPhone,
} from '@/utilities/validateEnquiryFields'

describe('resolveEnquiryRecipientFromSettings', () => {
  const env = {
    companyEmail: 'company@example.com',
    adminEmail: 'admin@example.com',
    smtpFromEmail: 'from@example.com',
  }

  it('uses the selected admin user email', () => {
    expect(
      resolveEnquiryRecipientFromSettings(
        {
          enquiryRecipientSource: 'adminUser',
          enquiryEmail: 'ignored@example.com',
          enquiryAdminUser: { email: 'ops@example.com' },
        },
        env,
      ),
    ).toBe('ops@example.com')
  })

  it('uses custom enquiry email when source is customEmail', () => {
    expect(
      resolveEnquiryRecipientFromSettings(
        {
          enquiryRecipientSource: 'customEmail',
          enquiryEmail: 'inbox@example.com',
          enquiryAdminUser: { email: 'ops@example.com' },
        },
        env,
      ),
    ).toBe('inbox@example.com')
  })

  it('falls back to COMPANY_EMAIL then ADMIN_EMAIL then SMTP_FROM_EMAIL', () => {
    expect(resolveEnquiryRecipientFromSettings({ enquiryRecipientSource: 'customEmail' }, env)).toBe(
      'company@example.com',
    )
    expect(
      resolveEnquiryRecipientFromSettings(
        { enquiryRecipientSource: 'customEmail' },
        { adminEmail: 'admin@example.com', smtpFromEmail: 'from@example.com' },
      ),
    ).toBe('admin@example.com')
    expect(
      resolveEnquiryRecipientFromSettings(
        { enquiryRecipientSource: 'customEmail' },
        { smtpFromEmail: 'from@example.com' },
      ),
    ).toBe('from@example.com')
  })

  it('returns undefined when nothing is configured', () => {
    expect(resolveEnquiryRecipientFromSettings(null, {})).toBeUndefined()
  })
})

describe('validateEnquiryFields', () => {
  it('accepts a complete valid enquiry', () => {
    expect(
      validateEnquiryFields({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+44 7700 900123',
        message: 'I would like to book a tasting session.',
      }),
    ).toBeNull()
  })

  it('rejects invalid email and phone', () => {
    expect(validateEnquiryEmail('not-an-email')).toMatch(/valid email/i)
    expect(validateEnquiryPhone('123')).toMatch(/phone/i)
    expect(validateEnquiryPhone('abc-def')).toMatch(/phone/i)
    expect(validateEnquiryName('A')).toMatch(/2 characters/i)
    expect(validateEnquiryMessage('short')).toMatch(/10 characters/i)
  })

  it('parses submission rows and detects enquiry forms', () => {
    expect(
      parseEnquiryFields([
        { field: 'name', value: 'Ada' },
        { field: 'email', value: 'ada@example.com' },
      ]),
    ).toEqual({ name: 'Ada', email: 'ada@example.com' })

    expect(
      formHasEnquiryFields([
        { name: 'name' },
        { name: 'email' },
        { name: 'phone' },
        { name: 'message' },
      ]),
    ).toBe(true)
    expect(formHasEnquiryFields([{ name: 'email' }, { name: 'message' }])).toBe(false)
  })
})

describe('sendEnquiryNotificationEmail', () => {
  it('skips without throwing when no email adapter is configured', async () => {
    const { sendEnquiryNotificationEmail } = await import(
      '@/utilities/sendEnquiryNotificationEmail'
    )
    const warn = () => undefined
    const payload = {
      config: { email: undefined },
      logger: { warn },
    }
    await expect(
      sendEnquiryNotificationEmail({
        payload: payload as never,
        submissionId: 1,
        fields: {
          name: 'Jane',
          email: 'jane@example.com',
          phone: '07700900123',
          message: 'Hello there, this is a test enquiry.',
        },
      }),
    ).resolves.toBeUndefined()
  })
})
