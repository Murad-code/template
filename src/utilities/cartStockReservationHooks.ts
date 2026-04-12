import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionBeforeDeleteHook } from 'payload'

import { isCartStockReservationEnabled } from '@/config/stock'
import { deleteReservationsForCart, syncStockReservationsFromCartDoc, validateCartReservationLimits } from '@/utilities/stockReservations'

type CartDoc = {
  id?: number | string
  items?: unknown[] | null
  status?: string | null
  purchasedAt?: string | null
}

const productsSlug = 'products'
const variantsSlug = 'variants'

/**
 * Validates cart lines against physical inventory minus other carts' reservations.
 */
export const cartReservationBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!isCartStockReservationEnabled()) return data

  const items = (data as CartDoc).items as Parameters<typeof validateCartReservationLimits>[0]['items']
  if (!items?.length) return data

  const cartId =
    operation === 'update' && originalDoc != null && (originalDoc as CartDoc).id != null
      ? (originalDoc as CartDoc).id
      : (data as CartDoc).id

  // Create flow: ID is assigned after beforeChange; reservation validation runs on subsequent updates.
  if (cartId == null) return data

  await validateCartReservationLimits({
    req,
    cartId,
    items,
    productsSlug,
    variantsSlug,
  })

  return data
}

/**
 * Rebuilds TTL reservations from cart lines; clears them when cart is purchased or empty.
 */
export const cartReservationAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (!isCartStockReservationEnabled()) return

  const d = doc as CartDoc
  const id = d.id
  if (id == null) return

  const isPurchased = d.status === 'purchased' || Boolean(d.purchasedAt)
  const empty = !d.items?.length

  if (isPurchased || empty) {
    await deleteReservationsForCart({ req, cartId: id })
    return
  }

  await syncStockReservationsFromCartDoc({
    req,
    cartId: id,
    items: d.items as Parameters<typeof syncStockReservationsFromCartDoc>[0]['items'],
  })
}

export const cartReservationBeforeDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (!isCartStockReservationEnabled() || id == null) return
  await deleteReservationsForCart({ req, cartId: id })
}
