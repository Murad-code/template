import React from 'react'

import { Spec, SpecList } from '@/components/ui/spec-list'

type TrustItem = {
  text: string
  id?: string | null
}

type HeroTrustRowProps = {
  enabled?: boolean | null
  items?: TrustItem[] | null
}

/**
 * The promises a hero makes — delivery, provenance, who teaches — in the same
 * specification voice the rest of the site uses for concrete facts.
 */
export const HeroTrustRow: React.FC<HeroTrustRowProps> = ({ enabled, items }) => {
  if (!enabled || !items?.length) return null

  return (
    <SpecList className="mt-8">
      {items.map((item, index) => (
        <Spec key={item.id ?? index} label="Included">
          {item.text}
        </Spec>
      ))}
    </SpecList>
  )
}
