import { getSiteConfig } from '@/config/site'

/**
 * Payload admin sidebar link(s) to the live storefront (afterNavLinks).
 * Targets depend on PROJECT_TYPE — no manual Header global needed for Shop vs Book.
 */
export default async function ViewProductsLink() {
  const { ecommerceEnabled, bookingEnabled, serverURL } = getSiteConfig()
  const base = serverURL.replace(/\/$/, '')
  const linkClass =
    'nav__link block py-2 no-underline text-inherit hover:opacity-80'

  if (ecommerceEnabled && bookingEnabled) {
    return (
      <div className="flex flex-col gap-1 text-sm">
        <a href={`${base}/shop`} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View shop
        </a>
        <a href={`${base}/book`} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View book
        </a>
      </div>
    )
  }
  if (ecommerceEnabled) {
    return (
      <a
        href={`${base}/shop`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        style={{ padding: '0.5rem 0' }}
      >
        View shop
      </a>
    )
  }
  if (bookingEnabled) {
    return (
      <a
        href={`${base}/book`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        style={{ padding: '0.5rem 0' }}
      >
        View book
      </a>
    )
  }
  return (
    <a href={base} target="_blank" rel="noopener noreferrer" className={linkClass} style={{ padding: '0.5rem 0' }}>
      View site
    </a>
  )
}
