'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import type { Header } from '@/payload-types'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { navLinkClassName } from './navLinkClassName'
import { useAuth } from '@/providers/Auth'

type NavItem = NonNullable<Header['navItems']>[number]

type Props = {
  menu: NavItem[]
  ecommerceEnabled: boolean
}

export function HeaderClient({ menu, ecommerceEnabled }: Props) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="border-border bg-surface-header relative z-20 border-b">
      <nav className="flex items-center md:items-end justify-between container pt-2">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu ecommerceEnabled={ecommerceEnabled} menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex w-full items-end gap-6 md:w-1/3">
            <Link
              className="interactive-focus flex w-full items-center justify-center rounded-xs pt-4 pb-4 md:w-auto"
              href="/"
            >
              <LogoIcon className="h-auto w-6" />
              {/* The logo's own label describes the mark; a link needs to say
                  where it goes. */}
              <span className="sr-only">Home</span>
            </Link>
            {menu.length ? (
              <ul className="hidden gap-4 text-sm md:flex md:items-center">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      appearance="inline"
                      className={navLinkClassName({
                        active:
                          item.link.url && item.link.url !== '/'
                            ? pathname.includes(item.link.url)
                            : false,
                      })}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex justify-end md:w-1/3 gap-4 items-center">
            <Link
              className={cn(
                navLinkClassName({ active: pathname === '/login' }),
                'hidden md:inline-flex',
              )}
              href={user ? '/logout' : '/login'}
            >
              {user ? 'Log out' : 'Log in'}
            </Link>
            {ecommerceEnabled ? (
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  )
}
