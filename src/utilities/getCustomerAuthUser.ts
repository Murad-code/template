import type { Customer } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { isCustomerAuthUser } from '@/utilities/isCustomerAuthUser'

export async function getCustomerAuthUser(headers: Headers): Promise<Customer | null> {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return isCustomerAuthUser(user) ? user : null
}
