import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/utilities/cn'

export function SurfaceCard({ className, ...props }: React.ComponentProps<'div'>) {
  return <Card className={cn('gap-4 rounded-lg', className)} {...props} />
}

export function SurfaceCardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <CardHeader className={cn('pb-0', className)} {...props} />
}

export function SurfaceCardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <CardContent className={cn(className)} {...props} />
}
