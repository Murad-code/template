'use client'

import React, { useState } from 'react'

import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/ui/button'
import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'

export const NewsletterBlock: React.FC<NewsletterBlockProps> = (props) => {
  const {
    align,
    buttonLabel,
    description,
    eyebrow,
    placeholder,
    privacyNote,
    successMessage,
    title,
  } = props

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Subscription failed')
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <section className="container">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
        <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
        {status === 'success' ? (
          <p className="text-base font-medium">{successMessage || 'Thanks for subscribing.'}</p>
        ) : (
          <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
            <input
              aria-label="Email address"
              className="h-11 flex-1 rounded-md border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={placeholder || 'you@example.com'}
              required
              type="email"
              value={email}
            />
            <Button disabled={status === 'loading'} size="lg" type="submit">
              {status === 'loading' ? 'Subscribing…' : buttonLabel || 'Subscribe'}
            </Button>
          </form>
        )}
        {privacyNote && status !== 'success' && (
          <p className="mt-3 text-sm text-muted-foreground">{privacyNote}</p>
        )}
        {errorMessage && <p className="mt-3 text-sm text-destructive">{errorMessage}</p>}
      </div>
    </section>
  )
}
