import React from 'react'

export function BrandIcon() {
  const iconURL = process.env.NEXT_PUBLIC_BRAND_ICON_URL || process.env.NEXT_PUBLIC_BRAND_LOGO_URL || ''
  const brandName = process.env.COMPANY_NAME || process.env.SITE_NAME || 'Brand'

  if (!iconURL) {
    return (
      <span
        aria-label={`${brandName} icon`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 700,
          backgroundColor: '#111827',
          color: '#ffffff',
        }}
      >
        {brandName.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${brandName} icon`}
      src={iconURL}
      style={{
        width: 24,
        height: 24,
        objectFit: 'contain',
      }}
    />
  )
}
