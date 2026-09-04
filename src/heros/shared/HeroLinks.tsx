import React from 'react'

import { CMSLink } from '@/components/Link'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities/cn'

type HeroLinksProps = {
  className?: string
  links?: Page['hero']['links']
}

export const HeroLinks: React.FC<HeroLinksProps> = ({ className, links }) => {
  if (!Array.isArray(links) || links.length === 0) return null

  return (
    <ul className={cn('mt-8 flex flex-wrap gap-3', className)}>
      {links.map(({ link }, index) => (
        <li key={index}>
          <CMSLink size="lg" {...link} />
        </li>
      ))}
    </ul>
  )
}
