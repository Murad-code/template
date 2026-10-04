'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/utilities/cn'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/**
 * Month calendar, styled from the theme tokens rather than a second design
 * system's own theme.
 *
 * Days are round because a date is a single point, which is the one place on
 * this site where a full radius is the honest shape.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn(className)}
      classNames={{
        root: 'w-fit',
        months: 'relative flex flex-col gap-4',
        month: 'flex flex-col gap-4',
        month_caption: 'flex h-9 items-center justify-center',
        caption_label: 'text-body-sm font-medium',
        nav: 'flex items-center justify-between absolute inset-x-0 top-0 h-9 px-1 pointer-events-none',
        button_previous:
          'interactive-focus text-muted-foreground hover:bg-muted hover:text-foreground pointer-events-auto grid size-9 place-items-center rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-40',
        button_next:
          'interactive-focus text-muted-foreground hover:bg-muted hover:text-foreground pointer-events-auto grid size-9 place-items-center rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-40',
        month_grid: 'border-collapse',
        weekdays: 'flex',
        weekday: 'text-label text-muted-foreground w-10 font-normal uppercase',
        weeks: '',
        week: 'flex w-full',
        day: 'size-10 p-0.5 text-center',
        day_button:
          'interactive-focus text-body-sm hover:bg-muted size-9 rounded-full font-medium transition-colors',
        today: '[&_button]:ring-border-strong [&_button]:ring-1 [&_button]:ring-inset',
        selected:
          '[&_button]:bg-primary [&_button]:text-primary-foreground [&_button:hover]:bg-primary [&_button]:font-semibold',
        outside: '[&_button]:text-muted-foreground [&_button]:opacity-50',
        disabled:
          '[&_button]:text-muted-foreground [&_button]:pointer-events-none [&_button]:opacity-40',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" {...rest} />
          ) : (
            <ChevronRight className="size-4" {...rest} />
          ),
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
}
