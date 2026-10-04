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
      <SelectTrigger className="border-border bg-background text-body-sm interactive-focus hover:bg-muted mb-0 h-9 w-auto min-w-24 gap-2 rounded-sm border px-3 transition-colors">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="border-border bg-popover text-popover-foreground shadow-overlay rounded-md border">
        <SelectItem
          className="cursor-pointer rounded-sm focus:bg-surface-raised focus:text-text-primary"
          value="auto"
        >
          Auto
        </SelectItem>
        <SelectItem
          className="cursor-pointer rounded-sm focus:bg-surface-raised focus:text-text-primary"
          value="light"
        >
          Light
        </SelectItem>
        <SelectItem
          className="cursor-pointer rounded-sm focus:bg-surface-raised focus:text-text-primary"
          value="dark"
        >
          Dark
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
