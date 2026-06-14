import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

function collectSetCookie(response: Response): string[] {
  const anyHeaders = response.headers as Headers & { getSetCookie?: () => string[] }
  if (typeof anyHeaders.getSetCookie === 'function') {
    return anyHeaders.getSetCookie()
  }
  const raw = response.headers.get('set-cookie')
  return raw ? [raw] : []
}

export async function GET(request: Request): Promise<Response> {
  const requestHeaders = await headers()
  const origin = new URL(request.url).origin
  const cookieHeader = requestHeaders.get('cookie') ?? ''
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: requestHeaders })

  const baseRequest: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    },
  }

  const logoutPath =
    user?.collection === 'admins'
      ? '/api/admins/logout'
      : user?.collection === 'customers'
        ? '/api/customers/logout'
        : '/api/admins/logout'

  const logoutRes = await fetch(`${origin}${logoutPath}`, baseRequest).catch(() => null)

  const response = Response.redirect(new URL('/admin/login', request.url), 302)

  if (logoutRes) {
    for (const setCookie of collectSetCookie(logoutRes)) {
      response.headers.append('set-cookie', setCookie)
    }
  }

  return response
}
