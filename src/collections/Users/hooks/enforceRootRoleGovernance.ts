import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook, PayloadRequest } from 'payload'
import { APIError } from 'payload'

import { checkRole } from '@/access/utilities'
import type { Admin } from '@/payload-types'

const hasRootRole = (roles: Admin['roles'] | undefined | null): boolean => {
  return Array.isArray(roles) && roles.includes('root')
}

const rootUsersWhere = {
  roles: {
    equals: 'root',
  },
}

const isFirstUserCreate = async (req: PayloadRequest): Promise<boolean> => {
  const users = await req.payload.find({
    collection: 'admins',
    depth: 0,
    limit: 0,
    req,
  })

  return users.totalDocs === 0
}

export const enforceRootRoleGovernance: CollectionBeforeChangeHook = async ({
  operation,
  req,
  data,
  originalDoc,
}) => {
  const nextRoles = Array.isArray(data?.roles) ? data.roles : originalDoc?.roles
  const actingUserIsRoot = checkRole(['root'], req.user)
  const isSystemOperation = !req.user

  if (operation === 'create') {
    const firstUser = await isFirstUserCreate(req)

    if (!firstUser && hasRootRole(nextRoles) && !actingUserIsRoot && !isSystemOperation) {
      throw new APIError('Only root users can assign the root role.', 403)
    }

    return data
  }

  const originalWasRoot = hasRootRole(originalDoc?.roles)
  const nextIsRoot = hasRootRole(nextRoles)

  if (nextIsRoot && !actingUserIsRoot && !isSystemOperation) {
    throw new APIError('Only root users can assign the root role.', 403)
  }

  if (originalWasRoot && !nextIsRoot) {
    if (!actingUserIsRoot && !isSystemOperation) {
      throw new APIError('Only root users can remove the root role.', 403)
    }

    const rootUsers = await req.payload.find({
      collection: 'admins',
      depth: 0,
      limit: 2,
      where: rootUsersWhere,
      req,
    })

    if (rootUsers.totalDocs <= 1) {
      throw new APIError('Cannot remove the root role from the last root user.', 400)
    }
  }

  return data
}

export const preventLastRootDeletion: CollectionBeforeDeleteHook = async ({ req, id }) => {
  if (!id) return

  const userToDelete = await req.payload.findByID({
    collection: 'admins',
    id,
    depth: 0,
    req,
  })

  if (!hasRootRole(userToDelete?.roles)) return

  if (req.user && !checkRole(['root'], req.user)) {
    throw new APIError('Only root users can delete root accounts.', 403)
  }

  const rootUsers = await req.payload.find({
    collection: 'admins',
    depth: 0,
    limit: 2,
    where: rootUsersWhere,
    req,
  })

  if (rootUsers.totalDocs <= 1) {
    throw new APIError('Cannot delete the last root user.', 400)
  }
}
