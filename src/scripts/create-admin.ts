import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

const emailArg = process.argv[2]
const passwordArg = process.argv[3]
const nameArg = process.argv[4]

const adminEmail = emailArg || process.env.ADMIN_EMAIL
const adminPassword = passwordArg || process.env.ADMIN_PASSWORD
const adminName = nameArg || process.env.ADMIN_NAME || process.env.COMPANY_NAME || 'Admin User'

async function run() {
  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Missing admin credentials. Usage: pnpm create:admin <email> <password> [name] or set ADMIN_EMAIL/ADMIN_PASSWORD in env.',
    )
  }

  const email = adminEmail
  const password = adminPassword

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'admins',
    depth: 0,
    limit: 1,
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existing.docs.length > 0) {
    const user = existing.docs[0]
    await payload.update({
      collection: 'admins',
      id: user.id,
      data: {
        name: adminName,
        email,
        password,
        roles: ['admin'],
      },
    })
    payload.logger.info(`Updated existing user and granted admin: ${email}`)
    return
  }

  await payload.create({
    collection: 'admins',
    data: {
      name: adminName,
      email,
      password,
      roles: ['admin'],
    },
  })

  payload.logger.info(`Created new admin user: ${email}`)
}

void run()
