import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge resolves conflicts by class group, and it cannot see our
 * theme, so it has no way to know that `text-h2` is a size and
 * `text-muted-foreground` is a colour. Left alone it treats them as the same
 * group and silently drops one — which is how a primary button ended up with
 * no label colour.
 *
 * Declaring the scale here is the fix: anything named in `font-size` is
 * treated as a size, and everything else beginning `text-` stays a colour.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'h1',
            'h2',
            'h3',
            'h4',
            'body-lg',
            'body',
            'body-sm',
            'caption',
            'label',
          ],
        },
      ],
      shadow: [{ shadow: ['raised', 'overlay'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
