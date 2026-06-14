import { headers } from 'next/headers'

import { getCustomerAuthUser } from '@/utilities/getCustomerAuthUser'

export async function GET(): Promise<Response> {
  const requestHeaders = await headers()
  const user = await getCustomerAuthUser(requestHeaders)

  return Response.json(
    {
      user: user ?? null,
    },
    { status: 200 },
  )
}
