import React from 'react'

/**
 * Admin list cell: inventory value plus Low badge when at or below lowStockThreshold.
 */
export const InventoryCell: React.FC<{ data?: unknown; cellData?: unknown }> = ({ data, cellData }) => {
  const inv = typeof cellData === 'number' ? cellData : Number(cellData) || 0
  const threshold =
    data && typeof (data as { lowStockThreshold?: unknown }).lowStockThreshold === 'number'
      ? (data as { lowStockThreshold: number }).lowStockThreshold
      : 10
  const low = inv <= threshold

  return (
    <span className="inline-flex items-center gap-2">
      <span>{inv}</span>
      {low ? <span className="text-amber-800 dark:text-amber-400 text-xs font-medium uppercase">Low</span> : null}
    </span>
  )
}
