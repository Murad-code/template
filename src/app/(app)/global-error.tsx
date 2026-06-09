'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="container py-28">
          <Card className="mx-auto max-w-xl p-2 text-center">
            <CardContent className="p-8">
            <h1 className="text-2xl font-bold">Unexpected error</h1>
            <p className="mt-3 text-muted-foreground">
              Something went wrong while rendering this page.
            </p>
            <Button asChild className="mx-auto mt-6 rounded-full px-6 py-3 text-sm tracking-wide">
              <Link href="/">Go to Home</Link>
            </Button>
            </CardContent>
          </Card>
        </main>
      </body>
    </html>
  )
}
