import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

const emailArg = process.argv[2]
const passwordArg = process.argv[3]
const nameArg = process.argv[4]

const rootEmail = emailArg || process.env.ROOT_EMAIL
const rootPassword = passwordArg || process.env.ROOT_PASSWORD
const rootName = nameArg || process.env.ROOT_NAME || process.env.COMPANY_NAME || 'Root User'

async function run() {
  if (!rootEmail || !rootPassword) {
    throw new Error(
      'Missing root credentials. Usage: pnpm create:root <email> <password> [name] or set ROOT_EMAIL/ROOT_PASSWORD in env.',
    )
  }

  const email = rootEmail
  const password = rootPassword

  const payload = await getPayload({ config })

  const existingByEmail = await payload.find({
    collection: 'admins',
    depth: 0,
    limit: 1,
    where: {
      email: {
        equals: email,
      },
    },
  })

  let targetRootID: number

  if (existingByEmail.docs.length > 0) {
    const user = existingByEmail.docs[0]
    await payload.update({
      collection: 'admins',
      id: user.id,
      data: {
        name: rootName,
        email,
        password,
        roles: ['root'],
      },
    })
    targetRootID = user.id
    payload.logger.info(`Updated existing user and granted root access: ${email}`)
  } else {
    const created = await payload.create({
      collection: 'admins',
      data: {
        name: rootName,
        email,
        password,
        roles: ['root'],
      },
    })

    targetRootID = created.id
    payload.logger.info(`Created new root user: ${email}`)
  }

  const existingRootUsers = await payload.find({
    collection: 'admins',
    depth: 0,
    limit: 100,
    where: {
      roles: {
        equals: 'root',
      },
    },
  })

  const rootIDsToDelete = existingRootUsers.docs
    .map((admin) => admin.id)
    .filter((id) => id !== targetRootID)

  for (const id of rootIDsToDelete) {
    await payload.delete({
      collection: 'admins',
      id,
    })
  }

  payload.logger.info(`Single-root policy enforced. Retained root account: ${email}`)
}

void run()
