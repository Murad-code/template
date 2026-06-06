import React from 'react'

/**
 * Admin list cell: booking amount is stored in pence, display as GBP pounds.
 */
export const BookingAmountCell: React.FC<{ cellData?: unknown }> = ({ cellData }) => {
  if (cellData == null || cellData === '') return <span>-</span>

  const amountPence = typeof cellData === 'number' ? cellData : Number(cellData)
  if (!Number.isFinite(amountPence)) return <span>-</span>

  return <span>£{(amountPence / 100).toFixed(2)}</span>
}
