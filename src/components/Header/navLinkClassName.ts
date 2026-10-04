import { cn } from '@/utilities/cn'

/**
 * The header's own link style, which used to live inside `Button` as a `nav`
 * variant. It is not a button: it carries its own vertical padding to meet the
 * header's baseline, and the underline rule in `index.css` depends on that
 * padding. Keeping it here stops a layout decision from leaking into every
 * other control on the site.
 *
 * Set at reading size rather than the old wide-tracked 12px caps, which were
 * the hardest thing on the page to scan.
 */
export const navLinkClassName = ({ active }: { active?: boolean } = {}) =>
  cn(
    'navLink interactive-focus text-body-sm text-muted-foreground hover:text-foreground relative inline-flex items-end rounded-none pt-2 pb-6 transition-colors duration-[0.32s] ease-[var(--ease-smooth)]',
    active && 'active text-foreground',
  )
