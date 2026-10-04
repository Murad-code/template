import React from 'react'

/**
 * A hairline across the top of the window showing how far down the page you
 * are.
 *
 * No JavaScript and no scroll listener: the width comes from a CSS
 * scroll-driven animation in motion.css, which runs on the compositor. A
 * browser without support renders nothing, which is the right fallback for
 * something purely informational.
 */
export const ScrollProgress: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress from-primary via-accent to-primary pointer-events-none fixed top-0 left-0 z-50 h-[3px] w-full bg-gradient-to-r"
    />
  )
}
