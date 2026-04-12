import type { CollectionAfterChangeHook } from 'payload'

import { isLowStockEmailEnabled } from '@/config/stock'
import { sendLowStockAlertEmail } from '@/utilities/sendLowStockAlertEmail'

type ProductDoc = {
  id: number
  title?: string | null
  inventory?: number | null
  lowStockThreshold?: number | null
  enableVariants?: boolean | null
}

export const lowStockProductAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (!isLowStockEmailEnabled()) return

  const d = doc as ProductDoc
  if (d.enableVariants) return

  const threshold = d.lowStockThreshold
  if (threshold == null || typeof d.inventory !== 'number') return

  const prevInv =
    operation === 'update' && previousDoc && typeof (previousDoc as ProductDoc).inventory === 'number'
      ? (previousDoc as ProductDoc).inventory!
      : null

  const currInv = d.inventory

  if (operation === 'update' && prevInv != null && prevInv > threshold && currInv <= threshold) {
    await sendLowStockAlertEmail({
      payload: req.payload,
      product: d,
    })
  }
}

type VariantDoc = {
  id: number
  title?: string | null
  inventory?: number | null
  product?: number | { id: number; title?: string | null; lowStockThreshold?: number | null } | null
}

export const lowStockVariantAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (!isLowStockEmailEnabled()) return

  const d = doc as VariantDoc
  const thresholdSourceId = typeof d.product === 'object' && d.product?.id != null ? d.product.id : d.product
  if (thresholdSourceId == null || typeof d.inventory !== 'number') return

  const product = await req.payload.findByID({
    collection: 'products',
    id: typeof thresholdSourceId === 'number' ? thresholdSourceId : Number(thresholdSourceId),
    depth: 0,
    overrideAccess: true,
    req,
    select: { lowStockThreshold: true, title: true },
  })

  const threshold = (product as { lowStockThreshold?: number | null })?.lowStockThreshold
  if (threshold == null) return

  const prevInv =
    operation === 'update' && previousDoc && typeof (previousDoc as VariantDoc).inventory === 'number'
      ? (previousDoc as VariantDoc).inventory!
      : null

  const currInv = d.inventory

  if (operation === 'update' && prevInv != null && prevInv > threshold && currInv <= threshold) {
    await sendLowStockAlertEmail({
      payload: req.payload,
      product: {
        id: (product as { id: number }).id,
        title: (product as { title?: string | null }).title,
        inventory: currInv,
        lowStockThreshold: threshold,
      },
      variantLabel: d.title ?? `Variant #${d.id}`,
    })
  }
}
