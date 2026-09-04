import 'dotenv/config'

import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed, type SeedHomeLayout } from '@/endpoints/seed'

const homeLayout: SeedHomeLayout = process.argv[2] === 'legacy' ? 'legacy' : 'showcase'

async function run() {
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
  })

  const adminUser = users.docs[0]
  if (!adminUser) {
    throw new Error('No user found. Create an admin user first, then run the seed script again.')
  }

  const req = await createLocalReq({ user: adminUser }, payload)
  await seed({ payload, req, mode: 'hybrid', homeLayout })

  payload.logger.info(`Demo seed completed (hybrid, home: "${homeLayout}").`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
