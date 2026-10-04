import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  menu: Footer['navItems']
}

export function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav aria-label="Footer">
      <ul className="flex flex-col gap-1.5">
        {menu.map((item) => {
          return (
            <li key={item.id}>
              <CMSLink
                {...item.link}
                appearance="inline"
                className="text-body-sm text-muted-foreground hover:text-foreground interactive-focus inline-flex min-h-6 items-center rounded-xs transition-colors"
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
