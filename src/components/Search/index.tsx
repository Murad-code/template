'use client'

import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { SearchIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
  className?: string
}

export const Search: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement
    const newParams = new URLSearchParams(searchParams.toString())

    if (search.value) {
      newParams.set('q', search.value)
    } else {
      newParams.delete('q')
    }

    router.push(createUrl('/shop', newParams))
  }

  function clearSearch() {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('q')
    router.push(createUrl('/shop', newParams))
  }

  return (
    <form className={cn('relative w-full', className)} onSubmit={onSubmit}>
      <input
        autoComplete="off"
        className="w-full rounded-lg border bg-white px-4 py-2 pr-16 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-400"
        defaultValue={query}
        key={query}
        name="search"
        placeholder="Search for products..."
        type="text"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center gap-2">
        {query ? (
          <button
            aria-label="Clear search"
            className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
            onClick={clearSearch}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          aria-label="Submit search"
          className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
          type="submit"
        >
          <SearchIcon aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
