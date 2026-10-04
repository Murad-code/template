'use client'

import { useTheme } from '@/providers/Theme'
import { useEffect, useState } from 'react'

import type { Appearance } from '@stripe/stripe-js'

function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

/**
 * Stripe renders the card fields in its own iframe, so it cannot inherit our
 * CSS variables — it has to be handed the resolved values.
 *
 * Reading them from the document rather than hardcoding hexes is what keeps
 * the payment step looking like the rest of the site under any palette the
 * editor picks. It runs after mount because the variables are injected by
 * `ThemeStyles`, and again whenever the visitor switches light and dark.
 */
export function useStripeAppearance(): Appearance | undefined {
  const { theme } = useTheme()
  const [appearance, setAppearance] = useState<Appearance>()

  useEffect(() => {
    setAppearance({
      theme: 'stripe',
      variables: {
        borderRadius: readToken('--radius-sm', '6px'),
        colorBackground: readToken('--background', '#ffffff'),
        colorDanger: readToken('--destructive', '#b3261e'),
        colorIcon: readToken('--muted-foreground', '#6b7280'),
        colorPrimary: readToken('--primary', '#1f2937'),
        colorText: readToken('--foreground', '#111827'),
        colorTextPlaceholder: readToken('--muted-foreground', '#6b7280'),
        fontFamily: readToken('--font-sans', 'system-ui, sans-serif'),
        fontSizeBase: '16px',
        fontWeightBold: '600',
        fontWeightNormal: '500',
        gridColumnSpacing: '20px',
        gridRowSpacing: '20px',
        spacingUnit: '4px',
      },
    })
  }, [theme])

  return appearance
}
