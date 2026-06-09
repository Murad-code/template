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
      <SelectTrigger className="mb-0 w-auto min-w-24 cursor-pointer gap-2 border-0 bg-muted text-foreground shadow-sm ring-0 outline-hidden focus-visible:ring-0 focus-visible:outline-hidden px-3 md:pl-3">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="border-0 bg-muted text-foreground shadow-lg">
        <SelectItem className="cursor-pointer" value="auto">
          Auto
        </SelectItem>
        <SelectItem className="cursor-pointer" value="light">
          Light
        </SelectItem>
        <SelectItem className="cursor-pointer" value="dark">
          Dark
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
