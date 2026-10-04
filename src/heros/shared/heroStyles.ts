/**
 * Hero rich text comes from the CMS without classes, so the scale is applied
 * by descendant selector. One `clamp()` per level rather than three
 * breakpoint steps, which is what stopped the old 4rem heading from arriving
 * at full size on a phone.
 */
export const heroRichTextClassName =
  'mb-6 [&_h1]:text-display [&_h2]:text-h1 [&_p]:text-body-lg [&_p]:text-muted-foreground [&_p]:max-w-prose'
