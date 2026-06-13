import React from 'react'

type PaletteRow = {
  color1?: string | null
  color2?: string | null
  color3?: string | null
  color4?: string | null
  color5?: string | null
  lightText?: string | null
  darkText?: string | null
}

type PaletteSwatchCellProps = {
  data?: unknown
  rowData?: unknown
  cellData?: unknown
}

export const PaletteSwatchCell: React.FC<PaletteSwatchCellProps> = ({ data, rowData, cellData }) => {
  const row = ((rowData || data || {}) as PaletteRow) || {}
  const color1 = (typeof row.color1 === 'string' ? row.color1 : cellData) as string | null | undefined
  const swatches = [
    { key: 'Light BG', color: row.color1 },
    { key: 'Light Card', color: row.color2 },
    { key: 'Border', color: row.color3 },
    { key: 'Dark Card', color: row.color4 },
    { key: 'Dark BG', color: row.color5 },
    { key: 'Light Text', color: row.lightText },
    { key: 'Dark Text', color: row.darkText },
  ].filter((item): item is { key: string; color: string } => Boolean(item.color && item.color.trim()))
  const resolvedSwatches = swatches.length
    ? swatches
    : [{ key: 'Light BG', color: color1 }].filter(
        (item): item is { key: string; color: string } => Boolean(item.color && item.color.trim()),
      )

  if (!resolvedSwatches.length) {
    return <span style={{ color: 'var(--theme-elevation-500)' }}>—</span>
  }

  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', borderRadius: 6, border: '1px solid var(--theme-elevation-200)' }}>
      {resolvedSwatches.map((swatch, index) => (
        <span
          key={`${swatch.key}-${swatch.color}-${index}`}
          style={{
            width: 16,
            height: 20,
            backgroundColor: swatch.color,
            borderRight: index === resolvedSwatches.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}
          title={`${swatch.key}: ${swatch.color}`}
        />
      ))}
    </span>
  )
}
