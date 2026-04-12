/**
 * Stock / reservation feature flags (env-driven).
 */

export function isLowStockEmailEnabled(): boolean {
  return process.env.ENABLE_LOW_STOCK_ALERTS === 'true'
}

export function getLowStockAlertRecipient(): string | undefined {
  const to = process.env.LOW_STOCK_ALERT_TO?.trim()
  if (to) return to
  return process.env.SMTP_FROM_EMAIL?.trim() || undefined
}

export function isCartStockReservationEnabled(): boolean {
  return process.env.ENABLE_CART_STOCK_RESERVATION === 'true'
}

export function getCartReservationTtlMinutes(): number {
  const n = Number(process.env.CART_RESERVATION_TTL_MINUTES)
  if (Number.isFinite(n) && n > 0) return Math.min(Math.floor(n), 24 * 60)
  return 15
}

export function getStockReservationCleanupSecret(): string | undefined {
  const s = process.env.STOCK_RESERVATION_CLEANUP_SECRET?.trim()
  return s || undefined
}
