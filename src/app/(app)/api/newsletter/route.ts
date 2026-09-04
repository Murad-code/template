import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    // Hook for external providers (Resend audiences, Mailchimp, etc.)
    if (process.env.NEWSLETTER_WEBHOOK_URL) {
      await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
        body: JSON.stringify({ email, source: 'website-newsletter-block' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unable to process subscription.' }, { status: 500 })
  }
}
