'use client'

import Link from 'next/link'
import React from 'react'

export default function Error() {
  return (
    <div className="container py-28">
      <div className="mx-auto max-w-xl rounded-lg bg-white p-8 text-center shadow-sm shadow-black/10 dark:bg-black dark:shadow-black/40">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          We could not load this page. Please head back to the homepage.
        </p>
        <Link
          href="/"
          className="mx-auto mt-6 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium tracking-wide text-white hover:opacity-90 dark:bg-white dark:text-black"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}
