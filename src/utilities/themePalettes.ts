import type { Payload } from 'payload'

export const DEFAULT_THEME_PALETTE_KEY = 'default'

export type ThemePaletteSeed = {
  key: string
  name: string
  color1: string
  color2: string
  color3: string
  color4: string
  color5: string
  lightText: string
  darkText: string
  isSystem: boolean
}

// Curated palette library for clean, readable website UI combinations.
export const THEME_PALETTE_LIBRARY: ThemePaletteSeed[] = [
  {
    key: 'default',
    name: 'Default',
    color1: '#FFFFFF',
    color2: '#F6F7F9',
    color3: '#E5E7EB',
    color4: '#1F2937',
    color5: '#111827',
    lightText: '#111827',
    darkText: '#F9FAFB',
    isSystem: true,
  },
  {
    key: 'slate',
    name: 'Slate',
    color1: '#F8FAFC',
    color2: '#F1F5F9',
    color3: '#CBD5E1',
    color4: '#334155',
    color5: '#0F172A',
    lightText: '#0F172A',
    darkText: '#E2E8F0',
    isSystem: false,
  },
  {
    key: 'zinc',
    name: 'Zinc',
    color1: '#FAFAFA',
    color2: '#F4F4F5',
    color3: '#D4D4D8',
    color4: '#3F3F46',
    color5: '#18181B',
    lightText: '#18181B',
    darkText: '#FAFAFA',
    isSystem: false,
  },
  {
    key: 'warm-clay',
    name: 'Warm Clay',
    color1: '#FAF9F7',
    color2: '#F3F1ED',
    color3: '#D6B08B',
    color4: '#2A2622',
    color5: '#141210',
    lightText: '#1D1B19',
    darkText: '#F6F3EE',
    isSystem: false,
  },
  {
    key: 'sandstone',
    name: 'Sandstone',
    color1: '#FBFAF7',
    color2: '#F5F3EE',
    color3: '#C2A574',
    color4: '#2B2721',
    color5: '#15120F',
    lightText: '#1F1B16',
    darkText: '#F7F3EB',
    isSystem: false,
  },
  {
    key: 'forest',
    name: 'Forest',
    color1: '#F8FAF8',
    color2: '#EEF2EE',
    color3: '#78A587',
    color4: '#1F2421',
    color5: '#101412',
    lightText: '#1A201B',
    darkText: '#EAF2EC',
    isSystem: false,
  },
  {
    key: 'sage',
    name: 'Sage',
    color1: '#F9FAF9',
    color2: '#F0F3F0',
    color3: '#9AB59F',
    color4: '#222824',
    color5: '#121614',
    lightText: '#1B211D',
    darkText: '#ECF2EE',
    isSystem: false,
  },
  {
    key: 'ocean',
    name: 'Ocean',
    color1: '#F7FAFC',
    color2: '#EDF2F5',
    color3: '#78AFC8',
    color4: '#1E252A',
    color5: '#0F1418',
    lightText: '#182026',
    darkText: '#EAF2F8',
    isSystem: false,
  },
  {
    key: 'midnight',
    name: 'Midnight',
    color1: '#F7F8FC',
    color2: '#ECEFF5',
    color3: '#8FA7D6',
    color4: '#20242C',
    color5: '#11131A',
    lightText: '#171B24',
    darkText: '#F8FAFC',
    isSystem: false,
  },
  {
    key: 'indigo',
    name: 'Indigo',
    color1: '#F8F8FC',
    color2: '#EEEFF6',
    color3: '#9FA8E8',
    color4: '#222334',
    color5: '#121320',
    lightText: '#191A29',
    darkText: '#ECEEFE',
    isSystem: false,
  },
  {
    key: 'berry',
    name: 'Berry',
    color1: '#FCF8FA',
    color2: '#F3EDF1',
    color3: '#CC97B2',
    color4: '#2C2328',
    color5: '#171216',
    lightText: '#211A1F',
    darkText: '#F8EEF4',
    isSystem: false,
  },
  {
    key: 'sunset',
    name: 'Sunset',
    color1: '#FCF9F6',
    color2: '#F4EEE8',
    color3: '#D8A677',
    color4: '#2B241F',
    color5: '#17120F',
    lightText: '#211A16',
    darkText: '#F8F0E8',
    isSystem: false,
  },
]

export async function upsertThemePalettes(payload: Payload) {
  const docs = await Promise.all(
    THEME_PALETTE_LIBRARY.map(async (palette) => {
      const existing = await payload.find({
        collection: 'theme-palettes',
        depth: 0,
        limit: 1,
        where: {
          key: {
            equals: palette.key,
          },
        },
      })

      if (existing.docs.length) {
        return payload.update({
          collection: 'theme-palettes',
          id: existing.docs[0].id,
          data: palette,
          depth: 0,
        })
      }

      return payload.create({
        collection: 'theme-palettes',
        data: palette,
        depth: 0,
      })
    }),
  )

  const defaultPalette = docs.find((palette) => palette.key === DEFAULT_THEME_PALETTE_KEY) || docs[0]
  return { defaultPalette, docs }
}
