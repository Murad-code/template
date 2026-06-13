'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from '../types'

import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger className="mb-0 h-8 w-auto min-w-24 cursor-pointer gap-2 rounded-md border border-background bg-surface-soft-panel text-text-primary shadow-[var(--elevation-soft)] ring-0 outline-hidden transition-colors hover:bg-surface-raised focus-visible:ring-0 focus-visible:outline-hidden px-3 md:pl-3">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="rounded-md border border-background bg-surface-soft-panel text-text-primary shadow-[var(--elevation-soft-hover)]">
        <SelectItem className="cursor-pointer rounded-sm focus:bg-surface-raised focus:text-text-primary" value="auto">
          Auto
        </SelectItem>
        <SelectItem className="cursor-pointer rounded-sm focus:bg-surface-raised focus:text-text-primary" value="light">
          Light
        </SelectItem>
        <SelectItem className="cursor-pointer rounded-sm focus:bg-surface-raised focus:text-text-primary" value="dark">
          Dark
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
