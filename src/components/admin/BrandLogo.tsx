import React from 'react'

export function BrandLogo() {
  const logoURL = process.env.NEXT_PUBLIC_BRAND_LOGO_URL || process.env.NEXT_PUBLIC_BRAND_ICON_URL || ''
  const brandName = process.env.COMPANY_NAME || process.env.SITE_NAME || 'Brand'

  if (!logoURL) {
    return <span style={{ fontWeight: 700, fontSize: 18 }}>{brandName}</span>
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${brandName} logo`}
      src={logoURL}
      style={{
        maxHeight: 28,
        width: 'auto',
      }}
    />
  )
}
