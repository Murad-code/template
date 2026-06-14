import type { Admin, Customer } from '@/payload-types'

type AuthUserLike = Admin | Customer | null | undefined

/**
 * Payload auth() may resolve an admin user when an admin session exists.
 * Frontend account routes should only treat customer-auth sessions as logged in.
 */
export function isCustomerAuthUser(user: AuthUserLike): user is Customer {
  if (!user) return false
  return user.collection === 'customers'
}
