import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md bg-card text-black shadow-sm shadow-black/10 transition-colors dark:text-white dark:shadow-black/40">
      <XIcon className={clsx('h-6 transition-all ease-in-out hover:scale-110 ', className)} />
    </div>
  )
}
