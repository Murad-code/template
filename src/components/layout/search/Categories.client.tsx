'use client'
import React, { useCallback, useMemo } from 'react'

import { Category } from '@/payload-types'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import clsx from 'clsx'

type Props = {
  category: Category
}

export const AllCategoriesItem: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return !searchParams.get('category')
  }, [searchParams])

  const clearCategory = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    const newParams = params.toString()
    router.push(newParams ? `${pathname}?${newParams}` : pathname)
  }, [pathname, router, searchParams])

  return (
    <button
      onClick={clearCategory}
      className={clsx('hover:cursor-pointer', {
        ' underline': isActive,
      })}
    >
      All
    </button>
  )
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return searchParams.get('category') === String(category.id)
  }, [category.id, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete('category')
    } else {
      params.set('category', String(category.id))
    }

    const newParams = params.toString()

    router.push(newParams ? `${pathname}?${newParams}` : pathname)
  }, [category.id, isActive, pathname, router, searchParams])

  return (
    <button
      onClick={() => setQuery()}
      className={clsx('hover:cursor-pointer', {
        ' underline': isActive,
      })}
    >
      {category.title}
    </button>
  )
}
