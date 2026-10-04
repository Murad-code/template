'use client'

import { ChevronDownIcon } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { ListItem } from '.'

import { FilterItem } from './FilterItem'

export function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        setActive(listItem.title)
      }
    })
  }, [pathname, list, searchParams])

  return (
    <div className="relative" ref={ref}>
      <div
        className="border-input bg-background text-body-sm interactive-focus flex h-10 w-full items-center justify-between rounded-sm border px-3"
        onClick={() => {
          setOpenSelect(!openSelect)
        }}
      >
        <div>{active}</div>
        <ChevronDownIcon className="h-4" />
      </div>
      {openSelect && (
        <div
          className="bg-popover shadow-overlay absolute z-40 w-full rounded-b-md p-4"
          onClick={() => {
            setOpenSelect(false)
          }}
        >
          {list.map((item: ListItem, i) => (
            <FilterItem item={item} key={i} />
          ))}
        </div>
      )}
    </div>
  )
}
