import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter'
import { sorting } from '@/lib/constants'
import { Search } from '@/components/Search'
import { redirectIfEcommerceDisabled } from '@/utilities/requireEcommerce'
import React, { Suspense } from 'react'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  redirectIfEcommerceDisabled()
  return (
    <Suspense fallback={null}>
      <div className="container my-14 sm:my-20">
        {/* The page had no heading at all, which broke the document outline
            before it broke the look of it. */}
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="text-h1">Shop</h1>
          <Search className="md:w-80" />
        </header>

        <div className="grid gap-10 md:grid-cols-[11rem_1fr] md:gap-14 lg:grid-cols-[13rem_1fr]">
          {/* A rail, not a floating column: the rule gives the filters an edge
              to sit against so the gutter beside them reads as deliberate. */}
          <aside className="flex flex-col gap-8">
            <Categories />
            <FilterList list={sorting} title="Sort by" />
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </Suspense>
  )
}
