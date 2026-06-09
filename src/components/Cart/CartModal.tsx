'use client'

import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'
import { resolveProductVariantDisplay } from '@/utilities/resolveProductVariantDisplay'
import { LineItemRow } from '@/components/LineItemRow'

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    // Close the cart modal when the pathname changes.
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>

          <SheetDescription>Manage your cart here, add items to view the total.</SheetDescription>
        </SheetHeader>

        {!cart || cart?.items?.length === 0 ? (
          <div className="text-center flex flex-col items-center gap-2">
            <ShoppingCart className="h-16" />
            <p className="text-center text-2xl font-bold">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grow flex px-4">
            <div className="flex flex-col justify-between w-full">
              <ul className="grow overflow-auto py-4">
                {cart?.items?.map((item, i) => {
                  const product = item.product
                  const variant = item.variant

                  if (typeof product !== 'object' || !item || !product || !product.slug)
                    return <React.Fragment key={i} />
                  const variantObject = variant && typeof variant === 'object' ? variant : undefined
                  const { image, isVariant, price, variantLabel } = resolveProductVariantDisplay({
                    product,
                    variant: variantObject,
                  })

                  return (
                    <li className="flex w-full flex-col" key={i}>
                      <LineItemRow
                        actions={
                          <div className="absolute z-40 -mt-2 ml-[55px]">
                            <DeleteItemButton item={item} />
                          </div>
                        }
                        className="w-full px-1 py-4"
                        href={`/products/${(item.product as Product)?.slug}`}
                        imageAlt={image?.alt || product?.title || ''}
                        imageClassName="h-16 w-16"
                        imageUrl={image?.url || undefined}
                        price={price}
                        quantity={item.quantity || undefined}
                        title={product.title}
                        trailing={
                          <div className="ml-auto flex h-9 flex-row items-center rounded-lg bg-muted/60 shadow-sm">
                            <EditItemQuantityButton item={item} type="minus" />
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">{item.quantity}</span>
                            </p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        }
                        variantLabel={isVariant ? variantLabel : undefined}
                      />
                    </li>
                  )
                })}
              </ul>

              <div className="px-4">
                <div className="py-4 text-sm text-muted-foreground">
                  {typeof cart?.subtotal === 'number' && (
                    <div className="mb-3 flex items-center justify-between rounded-md bg-muted/40 px-2 pb-1 pt-1">
                      <p>Total</p>
                      <Price amount={cart?.subtotal} className="text-right text-base text-foreground" />
                    </div>
                  )}

                  <Button asChild>
                    <Link className="w-full" href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
