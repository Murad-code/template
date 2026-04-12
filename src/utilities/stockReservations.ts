import type { PayloadRequest, Where } from 'payload'

import { getCartReservationTtlMinutes, isCartStockReservationEnabled } from '@/config/stock'

type CartItemLike = {
  id?: string | null
  product?: number | { id: number } | null
  variant?: number | { id: number } | null
  quantity?: number | null
}

function productIdFromItem(item: CartItemLike): number | null {
  const p = item.product
  if (p == null) return null
  return typeof p === 'object' ? p.id : p
}

function variantIdFromItem(item: CartItemLike): number | null {
  const v = item.variant
  if (v == null) return null
  return typeof v === 'object' ? v.id : v
}

/** Sum reserved qty for SKU, excluding one cart line (same cart + cartItemId). */
export async function sumReservedForSkuExcludingLine(args: {
  req: PayloadRequest
  productId: number
  variantId: number | null
  excludeCartId: number | string
  excludeCartItemId: string | null | undefined
}): Promise<number> {
  const { req, productId, variantId, excludeCartId, excludeCartItemId } = args
  const now = new Date().toISOString()

  const andClause: Where[] = [
    { product: { equals: productId } },
    { expiresAt: { greater_than: now } },
  ]

  if (variantId != null) {
    andClause.push({ variant: { equals: variantId } })
  } else {
    andClause.push({ variant: { exists: false } })
  }

  const excludeSelf: Where =
    excludeCartItemId != null && excludeCartItemId !== ''
      ? ({
          or: [{ cart: { not_equals: excludeCartId } }, { cartItemId: { not_equals: excludeCartItemId } }],
        } as Where)
      : ({ cart: { not_equals: excludeCartId } } as Where)

  andClause.push(excludeSelf)

  const { docs } = await req.payload.find({
    collection: 'stock-reservations',
    where: { and: andClause },
    limit: 500,
    depth: 0,
    overrideAccess: true,
    req,
  })

  return docs.reduce((acc, row) => {
    const q = (row as { quantity?: number }).quantity
    return acc + (typeof q === 'number' ? q : 0)
  }, 0)
}

export async function validateCartReservationLimits(args: {
  req: PayloadRequest
  cartId: number | string
  items: CartItemLike[] | null | undefined
  productsSlug?: string
  variantsSlug?: string
}): Promise<void> {
  if (!isCartStockReservationEnabled() || !args.items?.length) return

  const { req, cartId } = args
  const productsSlug = args.productsSlug ?? 'products'
  const variantsSlug = args.variantsSlug ?? 'variants'

  for (const item of args.items) {
    const qty = item.quantity ?? 0
    if (qty < 1) continue
    if (!item.id) continue

    const productId = productIdFromItem(item)
    if (productId == null) continue

    const variantId = variantIdFromItem(item)

    const reservedOthers = await sumReservedForSkuExcludingLine({
      req,
      productId,
      variantId,
      excludeCartId: cartId,
      excludeCartItemId: item.id ?? undefined,
    })

    if (variantId != null) {
      const variant = await req.payload.findByID({
        collection: variantsSlug as 'variants',
        id: variantId,
        depth: 0,
        overrideAccess: true,
        req,
        select: { inventory: true },
      })
      const inv = (variant as { inventory?: number | null })?.inventory ?? 0
      if (inv - reservedOthers < qty) {
        throw new Error('Not enough stock available for one or more items.', {
          cause: { code: 'OutOfStock' as const },
        })
      }
    } else {
      const product = await req.payload.findByID({
        collection: productsSlug as 'products',
        id: productId,
        depth: 0,
        overrideAccess: true,
        req,
        select: { inventory: true },
      })
      const inv = (product as { inventory?: number | null })?.inventory ?? 0
      if (inv - reservedOthers < qty) {
        throw new Error('Not enough stock available for one or more items.', {
          cause: { code: 'OutOfStock' as const },
        })
      }
    }
  }
}

export async function deleteReservationsForCart(args: {
  req: PayloadRequest
  cartId: number | string
}): Promise<void> {
  const { req, cartId } = args
  const found = await req.payload.find({
    collection: 'stock-reservations',
    where: { cart: { equals: cartId } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
    req,
  })
  for (const doc of found.docs) {
    await req.payload.delete({
      collection: 'stock-reservations',
      id: doc.id,
      overrideAccess: true,
      req,
    })
  }
}

export async function syncStockReservationsFromCartDoc(args: {
  req: PayloadRequest
  cartId: number | string
  items: CartItemLike[] | null | undefined
}): Promise<void> {
  if (!isCartStockReservationEnabled()) return

  const { req, cartId, items } = args
  await deleteReservationsForCart({ req, cartId })

  if (!items?.length) return

  const ttlMs = getCartReservationTtlMinutes() * 60 * 1000
  const expiresAt = new Date(Date.now() + ttlMs).toISOString()
  const cartNumeric = typeof cartId === 'string' ? Number(cartId) : cartId
  if (!Number.isFinite(cartNumeric)) return

  for (const item of items) {
    const qty = item.quantity ?? 0
    if (qty < 1 || !item.id) continue

    const productId = productIdFromItem(item)
    if (productId == null) continue

    const variantId = variantIdFromItem(item)

    await req.payload.create({
      collection: 'stock-reservations',
      data: {
        cart: cartNumeric,
        cartItemId: item.id,
        product: productId,
        ...(variantId != null ? { variant: variantId } : {}),
        quantity: qty,
        expiresAt,
      },
      overrideAccess: true,
      req,
    })
  }
}
