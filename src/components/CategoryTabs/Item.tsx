'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  href: string
  title: string
}

export function Item({ href, title }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === href
  const q = searchParams.get('q')
  const DynamicTag = active ? 'p' : Link

  return (
    <li className="text-body-sm mt-2 flex">
      <DynamicTag
        className={clsx(
          'text-body-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full rounded-sm px-2 py-1',
          {
            'bg-muted text-foreground': active,
          },
        )}
        href={href}
        prefetch={!active ? false : undefined}
      >
        {title}
      </DynamicTag>
    </li>
  )
}
