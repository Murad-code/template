import configPromise from '@payload-config'
import type { Service } from '@/payload-types'
import { getPayload } from 'payload'

type FetchServicesArgs = {
  limit?: number | null
  populateBy?: 'collection' | 'selection' | null
  selectedDocs?: { value: Service | string | number }[] | null
}

export async function fetchServicesForBlock({
  limit = 3,
  populateBy = 'collection',
  selectedDocs,
}: FetchServicesArgs): Promise<Service[]> {
  if (populateBy === 'selection' && selectedDocs?.length) {
    return selectedDocs
      .map((doc) => (typeof doc.value === 'object' ? doc.value : null))
      .filter(Boolean) as Service[]
  }

  const payload = await getPayload({ config: configPromise })

  const fetchedServices = await payload.find({
    collection: 'services',
    depth: 1,
    limit: limit || 3,
    sort: 'name',
    where: {
      active: {
        equals: true,
      },
    },
  })

  return fetchedServices.docs
}
