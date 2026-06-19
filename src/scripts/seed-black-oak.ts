import 'dotenv/config'

import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed, type SeedMode } from '@/endpoints/seed'

const modeArg = process.argv[2]
const mode: SeedMode = modeArg === 'booking' || modeArg === 'ecommerce' || modeArg === 'hybrid' ? modeArg : 'hybrid'

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
  await seed({ payload, req, mode })

  payload.logger.info(`Black Oak seed completed in "${mode}" mode.`)
}

void run()
