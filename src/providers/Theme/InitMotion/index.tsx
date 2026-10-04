import Script from 'next/script'
import React from 'react'

/**
 * Arms the motion system before the first paint.
 *
 * Everything that starts hidden and is revealed on scroll is gated on
 * `data-motion`, so the page renders complete when scripting is unavailable
 * and when the visitor has asked for less movement. Setting the flag from an
 * effect instead would paint the content, then hide it, then animate it back
 * in.
 */
export const InitMotion: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    try {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.dataset.motion = 'on'
      }
    } catch (e) {}
  })();
  `,
      }}
      id="motion-script"
      strategy="beforeInteractive"
    />
  )
}
