import type { FieldHook } from 'payload'

import type { Admin } from '@/payload-types'

// ensure the first user created is a root user
// 1. lookup a single user on create as succinctly as possible
// 2. if there are no users found and root is not in roles, append `root`
// access control is already handled by this fields `access` property
// it ensures that only admins can create and update the `roles` field
export const ensureFirstUserIsRoot: FieldHook<Admin> = async ({ operation, req, value }) => {
  if (operation === 'create') {
    const users = await req.payload.find({ collection: 'admins', depth: 0, limit: 0 })
    if (users.totalDocs === 0) {
      const roles = value || []

      if (!roles.includes('root')) {
        return [...roles, 'root']
      }
    }
  }

  return value
}
