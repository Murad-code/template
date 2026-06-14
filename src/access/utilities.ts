const ROLE_INHERITANCE: Record<string, string[]> = {
  root: ['admin'],
}

const resolveUserRoles = (user?: unknown): string[] => {
  if (!user || typeof user !== 'object' || !('roles' in user)) return []

  const roles = (user as { roles?: unknown }).roles
  if (!Array.isArray(roles)) return []

  return roles.filter((role): role is string => typeof role === 'string')
}

export const hasRole = (role: string, user?: unknown): boolean => {
  const userRoles = resolveUserRoles(user)

  return userRoles.some((assignedRole) => {
    if (assignedRole === role) return true

    const inheritedRoles = ROLE_INHERITANCE[assignedRole] || []
    return inheritedRoles.includes(role)
  })
}

export const checkRole = (allRoles: string[] = [], user?: unknown): boolean => {
  if (user && allRoles) {
    return allRoles.some((role) => {
      return hasRole(role, user)
    })
  }

  return false
}
