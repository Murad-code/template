import type { FieldAccess } from 'payload'

import { checkRole } from '@/access/utilities'

export const customerOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false

  // Customers have no role field in the split model.
  // Admin/root users always carry elevated roles and should be excluded.
  return !checkRole(['admin', 'root'], user)
}
