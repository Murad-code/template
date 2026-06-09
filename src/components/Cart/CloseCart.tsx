import clsx from 'clsx'
import { IconSquareButton } from '@/components/ui/icon-square-button'
import { XIcon } from 'lucide-react'
import React from 'react'

export function CloseCart({ className }: { className?: string }) {
  return (
    <IconSquareButton aria-label="Close cart">
      <XIcon className={clsx('h-6 transition-all ease-in-out hover:scale-110 ', className)} />
    </IconSquareButton>
  )
}
