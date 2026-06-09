import { Price } from '@/components/Price'
import { cn } from '@/utilities/cn'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type LineItemRowProps = {
  title: string
  href?: string
  imageUrl?: string
  imageAlt?: string
  price?: number
  quantity?: number
  variantLabel?: string
  actions?: React.ReactNode
  trailing?: React.ReactNode
  className?: string
  imageClassName?: string
}

export const LineItemRow: React.FC<LineItemRowProps> = ({
  title,
  href,
  imageUrl,
  imageAlt,
  price,
  quantity,
  variantLabel,
  actions,
  trailing,
  className,
  imageClassName,
}) => {
  const Content = (
    <>
      <div
        className={cn(
          'flex h-20 w-20 items-stretch justify-stretch rounded-lg bg-muted/40 p-2 shadow-sm',
          imageClassName,
        )}
      >
        <div className="relative h-full w-full overflow-hidden rounded-md">
          {imageUrl ? (
            <Image
              alt={imageAlt || title}
              className="rounded-md object-cover"
              fill
              src={imageUrl}
              sizes="80px"
            />
          ) : null}
        </div>
      </div>

      <div className="flex grow items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium leading-tight">{title}</p>
          {variantLabel ? (
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {variantLabel}
            </p>
          ) : null}
          {typeof quantity === 'number' ? <div className="text-sm text-muted-foreground">x{quantity}</div> : null}
        </div>

        <div className="flex flex-col items-end gap-2">
          {typeof price === 'number' ? <Price amount={price} className="text-right text-sm" /> : null}
          {trailing}
        </div>
      </div>
    </>
  )

  return (
    <div className={cn('relative flex items-start gap-4', className)}>
      {actions}
      {href ? (
        <Link className="z-10 flex grow items-start gap-4" href={href}>
          {Content}
        </Link>
      ) : (
        <div className="flex grow items-start gap-4">{Content}</div>
      )}
    </div>
  )
}
