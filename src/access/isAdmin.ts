import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Atomic access checker that verifies if the user has the admin role.
 *
 * @returns true if user is an admin, false otherwise
 */
export const isAdmin: Access = ({ req }) => {
  if (req.user) {
    return checkRole(['admin'], req.user)
  }

  return false
}

/**
 * Atomic access checker that verifies if the user has the root role.
 *
 * @returns true if user is root, false otherwise
 */
export const isRoot: Access = ({ req }) => {
  if (req.user) {
    return checkRole(['root'], req.user)
  }

  return false
}

/**
 * Atomic access checker that verifies if the user has admin-level access.
 * Root users are considered admin-level through role inheritance.
 *
 * @returns true if user has admin-level access, false otherwise
 */
export const isAdminOrRoot: Access = ({ req }) => {
  if (req.user) {
    return checkRole(['admin', 'root'], req.user)
  }

  return false
}
