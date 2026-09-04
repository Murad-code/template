import React from 'react'

import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import type { LogoCloudBlock as LogoCloudBlockProps } from '@/payload-types'
import Link from 'next/link'

import { LogoCloudMarquee } from './Component.client'

function LogoItem({
  image,
  label,
  url,
}: NonNullable<LogoCloudBlockProps['logos']>[number]) {
  const content = (
    <div className="flex h-16 items-center justify-center rounded-xl border border-border bg-card px-6">
      {image && typeof image === 'object' ? (
        <Media className="max-h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" resource={image} />
      ) : (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  )

  if (url) {
    return (
      <Link href={url} rel="noopener noreferrer" target="_blank">
        {content}
      </Link>
    )
  }

  return content
}

export const LogoCloudBlock: React.FC<LogoCloudBlockProps> = (props) => {
  const { align, description, eyebrow, layout, logos, title } = props

  if (!logos?.length) return null

  return (
    <section className="container">
      <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />
      {layout === 'marquee' ? (
        <LogoCloudMarquee logos={logos} />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {logos.map((logo, index) => (
            <LogoItem key={index} {...logo} />
          ))}
        </div>
      )}
    </section>
  )
}
