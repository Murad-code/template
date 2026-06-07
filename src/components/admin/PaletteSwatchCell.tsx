import React from 'react'

type PaletteRow = {
  color1?: string | null
  color2?: string | null
  color3?: string | null
  color4?: string | null
  color5?: string | null
}

type PaletteSwatchCellProps = {
  data?: unknown
  rowData?: unknown
  cellData?: unknown
}

export const PaletteSwatchCell: React.FC<PaletteSwatchCellProps> = ({ data, rowData, cellData }) => {
  const row = ((rowData || data || {}) as PaletteRow) || {}
  const color1 = (typeof row.color1 === 'string' ? row.color1 : cellData) as string | null | undefined
  const colors = [row.color1, row.color2, row.color3, row.color4, row.color5].filter(
    (color): color is string => Boolean(color && color.trim()),
  )
  const resolvedColors = colors.length ? colors : [color1].filter((color): color is string => Boolean(color && color.trim()))

  if (!resolvedColors.length) {
    return <span style={{ color: 'var(--theme-elevation-500)' }}>—</span>
  }

  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', borderRadius: 6, border: '1px solid var(--theme-elevation-200)' }}>
      {resolvedColors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          style={{
            width: 24,
            height: 20,
            backgroundColor: color,
            borderRight: index === resolvedColors.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}
          title={color}
        />
      ))}
    </span>
  )
}
