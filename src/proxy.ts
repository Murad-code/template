import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Strip stale `?notFound=` params from admin collection list URLs.
 * Payload adds this after redirecting from a deleted document ID; leaving it in
 * the URL re-triggers the error banner on every visit.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin/collections/')) {
    return NextResponse.next()
  }

  if (!request.nextUrl.searchParams.has('notFound')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.searchParams.delete('notFound')
  return NextResponse.redirect(url)
}

export const config = {
  matcher: '/admin/collections/:path*',
}
