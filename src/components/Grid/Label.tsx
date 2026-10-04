import clsx from 'clsx'
import React from 'react'

import { Price } from '@/components/Price'

type Props = {
  amount: number
  position?: 'bottom' | 'center'
  title: string
}

/**
 * The caption on a full-bleed product tile.
 *
 * One bar rather than the two floating pills this used to be: a title pill and
 * a price pill side by side read as two unrelated chips stuck on a photo, and
 * were the main reason the carousel did not look like the rest of the shop.
 */
export const Label: React.FC<Props> = ({ amount, position = 'bottom', title }) => {
  return (
    <div
      className={clsx('@container/label absolute inset-x-0 bottom-0 p-3', {
        '': position === 'center',
      })}
    >
      <div className="border-border/60 bg-card/85 text-card-foreground flex items-center justify-between gap-3 rounded-sm border px-3 py-2 backdrop-blur-md">
        <h3 className="text-body-sm line-clamp-1 font-medium">{title}</h3>

        <Price
          amount={amount}
          className="text-body-sm shrink-0 font-mono"
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  )
}
