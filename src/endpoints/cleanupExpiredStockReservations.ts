import type { Endpoint } from 'payload'

import { getStockReservationCleanupSecret } from '@/config/stock'

/**
 * POST /api/stock-reservations/cleanup-expired
 * Authorization: Bearer <STOCK_RESERVATION_CLEANUP_SECRET>
 * Intended for cron (see docs/deploy.md).
 */
export const cleanupExpiredStockReservationsEndpoint: Endpoint = {
  path: '/stock-reservations/cleanup-expired',
  method: 'post',
  handler: async (req) => {
    const expected = getStockReservationCleanupSecret()
    const auth = req.headers.get('authorization')
    if (!expected || auth !== `Bearer ${expected}`) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date().toISOString()
    let deleted = 0

    for (;;) {
      const { docs } = await req.payload.find({
        collection: 'stock-reservations',
        where: { expiresAt: { less_than_equal: now } },
        limit: 100,
        depth: 0,
        overrideAccess: true,
        req,
      } as never)
      if (!docs.length) break
      for (const doc of docs) {
        await req.payload.delete({
          collection: 'stock-reservations',
          id: doc.id,
          overrideAccess: true,
          req,
        } as never)
        deleted++
      }
    }

    return Response.json({ ok: true, deleted })
  },
}
