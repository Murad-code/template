import { navLinkClassName } from '@/components/Header/navLinkClassName'
import { cn } from '@/utilities/cn'
import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <button className={cn(navLinkClassName(), className)} type="button" {...rest}>
      <span>Cart</span>

      {quantity ? (
        <>
          <span>•</span>
          <span>{quantity}</span>
        </>
      ) : null}
    </button>
  )
}
