'use client'

import React from 'react'

import { Media } from '@/components/Media'
import type { LogoCloudBlock } from '@/payload-types'

type Logo = NonNullable<LogoCloudBlock['logos']>[number]

export const LogoCloudMarquee: React.FC<{ logos: Logo[] }> = ({ logos }) => {
  const items = [...logos, ...logos]

  return (
    <div className="overflow-hidden border-y border-border py-6">
      <div className="flex w-max animate-carousel gap-4">
        {items.map((logo, index) => (
          <div
            className="flex h-16 min-w-[160px] items-center justify-center rounded-xl border border-border bg-card px-6"
            key={index}
          >
            {logo.image && typeof logo.image === 'object' ? (
              <Media className="max-h-8 w-auto opacity-70 grayscale" resource={logo.image} />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">{logo.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
