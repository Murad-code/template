'use client'

import Link from 'next/link'

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="container py-28">
          <div className="mx-auto max-w-xl rounded-lg bg-white p-8 text-center shadow-sm shadow-black/10 dark:bg-black dark:shadow-black/40">
            <h1 className="text-2xl font-bold">Unexpected error</h1>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">
              Something went wrong while rendering this page.
            </p>
            <Link
              href="/"
              className="mx-auto mt-6 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium tracking-wide text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              Go to Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
