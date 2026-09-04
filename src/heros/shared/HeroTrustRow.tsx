import React from 'react'

type TrustItem = {
  text: string
  id?: string | null
}

type HeroTrustRowProps = {
  enabled?: boolean | null
  items?: TrustItem[] | null
}

export const HeroTrustRow: React.FC<HeroTrustRowProps> = ({ enabled, items }) => {
  if (!enabled || !items?.length) return null

  return (
    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <li className="flex items-center gap-2" key={item.id ?? index}>
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
          {item.text}
        </li>
      ))}
    </ul>
  )
}
