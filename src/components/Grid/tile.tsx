import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Label } from '@/components/Grid/Label'
import clsx from 'clsx'
import React from 'react'

type Props = {
  active?: boolean
  isInteractive?: boolean
  label?: {
    amount: number
    position?: 'bottom' | 'center'
    title: string
  }
  media: MediaType
}

export const GridTileImage: React.FC<Props> = ({
  active,
  isInteractive = true,
  label,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'group border-border bg-card hover:border-border-strong flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border transition-colors',
        {
          'bg-muted/60': active,
          relative: label,
        },
      )}
    >
      {props.media ? (
        <Media
          className={clsx('relative h-full w-full object-cover', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
          })}
          imgClassName="h-full w-full object-cover"
          resource={props.media}
          size="(min-width: 768px) 33vw, 66vw"
        />
      ) : null}
      {label ? <Label amount={label.amount} position={label.position} title={label.title} /> : null}
    </div>
  )
}
