import { Button } from '@/components/ui/button'
import { SurfaceCard } from '@/components/ui/surface-card'
import { cn } from '@/utilities/cn'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type AccountDetailPanelProps = {
  backHref?: string
  backLabel?: string
  badgeLabel: string
  children: React.ReactNode
}

export const AccountDetailPanel: React.FC<AccountDetailPanelProps> = ({
  backHref,
  backLabel,
  badgeLabel,
  children,
}) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-8">
        {backHref && backLabel ? (
          <Button asChild variant="ghost">
            <Link href={backHref}>
              <ChevronLeftIcon />
              {backLabel}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        <h1 className="rounded bg-primary/10 px-2 text-sm font-mono uppercase tracking-[0.07em]">
          <span>{badgeLabel}</span>
        </h1>
      </div>

      <SurfaceCard className="gap-12 px-6 py-4">{children}</SurfaceCard>
    </div>
  )
}

export const AccountDetailMetaLabel: React.FC<React.ComponentProps<'p'>> = ({
  className,
  ...props
}) => (
  <p className={cn('mb-1 text-sm font-mono uppercase text-muted-foreground', className)} {...props} />
)
