import React from 'react'

const productsUrl =
  typeof process.env.NEXT_PUBLIC_SERVER_URL !== 'undefined'
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/shop`
    : '/shop'

/**
 * Renders a "View Products" link in the Payload admin sidebar (afterNavLinks).
 * Opens the frontend products/shop page. Configure in payload.config.ts:
 * admin.components.afterNavLinks: ['@/components/ViewProductsLink']
 */
export default function ViewProductsLink() {
  return (
    <a
      href={productsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="nav__link"
      style={{ display: 'block', padding: '0.5rem 0', textDecoration: 'none', color: 'inherit' }}
    >
      View Products
    </a>
  )
}
