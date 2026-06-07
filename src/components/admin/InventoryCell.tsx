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
  const critical = threshold > 0 && inv <= Math.max(1, Math.floor(threshold / 2))
  const badgeStyle: React.CSSProperties = critical
    ? {
        marginLeft: 8,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 4,
        padding: '1px 6px',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        color: '#dc2626',
        backgroundColor: 'var(--theme-elevation-100)',
        lineHeight: 1.2,
      }
    : {
        marginLeft: 8,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 4,
        padding: '1px 6px',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        color: '#ca8a04',
        backgroundColor: 'var(--theme-elevation-100)',
        lineHeight: 1.2,
      }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span>{inv}</span>
      {low ? <span style={badgeStyle}>{critical ? 'Critical' : 'Low'}</span> : null}
    </span>
  )
}
