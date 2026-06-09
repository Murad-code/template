'use client'

import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Error() {
  return (
    <div className="container py-28">
      <Card className="mx-auto max-w-xl p-2 text-center">
        <CardContent className="p-8">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="mt-3 text-muted-foreground">
          We could not load this page. Please head back to the homepage.
        </p>
        <Button asChild className="mx-auto mt-6 rounded-full px-6 py-3 text-sm tracking-wide">
          <Link href="/">Go to Home</Link>
        </Button>
        </CardContent>
      </Card>
    </div>
  )
}
