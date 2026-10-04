import React from 'react'

/**
 * A slowly looping strip of short phrases.
 *
 * Reads well directly under a hero, where it says what the business does in
 * the first screenful and its movement pulls the eye past the fold.
 *
 * Pure CSS: the loop is an infinite keyframe animation in motion.css that
 * pauses on hover and focus, so there is no JavaScript and no timer.
 */
export const Marquee: React.FC<{ items: string[] }> = ({ items }) => {
  // Too few and the loop is visibly a loop rather than a strip.
  if (items.length < 3) return null

  return (
    <div className="marquee bg-surface-footer border-border-subtle border-y py-5">
      {/* Rendered twice, and the track slides by exactly half its own width:
          that is what makes the seam invisible. The second copy is hidden
          from assistive technology so the strip is announced once. */}
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1 || undefined}>
            {items.map((item) => (
              <li
                key={item}
                className="text-text-inverse/70 flex shrink-0 items-center gap-6 px-6 text-sm font-semibold tracking-[0.2em] uppercase"
              >
                {item}
                <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
