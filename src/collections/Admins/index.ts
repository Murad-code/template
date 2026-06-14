import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'
import { ensureFirstUserIsRoot } from '@/collections/Users/hooks/ensureFirstUserIsAdmin'
import { enforceRootRoleGovernance, preventLastRootDeletion } from '@/collections/Users/hooks/enforceRootRoleGovernance'

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['admin'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsRoot],
      },
      options: [
        {
          label: 'root',
          value: 'root',
        },
        {
          label: 'admin',
          value: 'admin',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [enforceRootRoleGovernance],
    beforeDelete: [preventLastRootDeletion],
  },
}
