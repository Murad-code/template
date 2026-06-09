'use client'

import { useEffect } from 'react'

import { getLandingThemeCss } from '@/config/siteTheme'

type SiteThemeLivePreviewMessage = {
  type: 'site-theme-live-preview'
  payload: {
    paletteMode?: 'palette' | 'custom'
    palette?: Record<string, string | null> | null
    darkPalette?: Record<string, string | null> | null
    customPalette?: Record<string, string | null> | null
    typography?: {
      bodyFont?: string | null
      headingFont?: string | null
      monoFont?: string | null
    } | null
  }
}

const STYLE_ID = 'site-theme-live-preview-overrides'

function upsertStyle(css: string) {
  let styleElement = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = STYLE_ID
    document.head.appendChild(styleElement)
  }
  styleElement.textContent = css
}

export function ThemePreviewLiveSync() {
  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      // Only accept preview sync events from the same origin admin UI.
      if (event.origin !== window.location.origin) return
      const data = event.data as SiteThemeLivePreviewMessage | null
      if (!data || data.type !== 'site-theme-live-preview') return

      upsertStyle(getLandingThemeCss(data.payload))
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return null
}
