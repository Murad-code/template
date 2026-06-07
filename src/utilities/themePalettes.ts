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
    color1: '#F8EFE8',
    color2: '#FFF8F4',
    color3: '#E7D2C2',
    color4: '#7C4A36',
    color5: '#3B241A',
    lightText: '#3B241A',
    darkText: '#F8EDE2',
    isSystem: false,
  },
  {
    key: 'sandstone',
    name: 'Sandstone',
    color1: '#F5F1E8',
    color2: '#FDFAF3',
    color3: '#E4D8BA',
    color4: '#70583E',
    color5: '#3D2F1F',
    lightText: '#3D2F1F',
    darkText: '#F7F0E5',
    isSystem: false,
  },
  {
    key: 'forest',
    name: 'Forest',
    color1: '#EDF5EF',
    color2: '#F6FBF7',
    color3: '#C7DDCB',
    color4: '#24553A',
    color5: '#132C1D',
    lightText: '#163620',
    darkText: '#D8EFE0',
    isSystem: false,
  },
  {
    key: 'sage',
    name: 'Sage',
    color1: '#F1F5F2',
    color2: '#F7FAF7',
    color3: '#C9D7CB',
    color4: '#3D5D46',
    color5: '#1E3325',
    lightText: '#1E3325',
    darkText: '#E4F0E7',
    isSystem: false,
  },
  {
    key: 'ocean',
    name: 'Ocean',
    color1: '#EAF6FB',
    color2: '#F2FAFE',
    color3: '#C7E6F3',
    color4: '#1F5E7A',
    color5: '#10364A',
    lightText: '#10364A',
    darkText: '#DDF2FC',
    isSystem: false,
  },
  {
    key: 'midnight',
    name: 'Midnight',
    color1: '#E7EEFB',
    color2: '#F4F7FF',
    color3: '#C8D8F8',
    color4: '#253A64',
    color5: '#101828',
    lightText: '#101828',
    darkText: '#F8FAFC',
    isSystem: false,
  },
  {
    key: 'indigo',
    name: 'Indigo',
    color1: '#EEF2FF',
    color2: '#F5F7FF',
    color3: '#C7D2FE',
    color4: '#3730A3',
    color5: '#1E1B4B',
    lightText: '#1E1B4B',
    darkText: '#E0E7FF',
    isSystem: false,
  },
  {
    key: 'berry',
    name: 'Berry',
    color1: '#FCF3F8',
    color2: '#FFF8FB',
    color3: '#F3C5D9',
    color4: '#9F2D5F',
    color5: '#4A1630',
    lightText: '#4A1630',
    darkText: '#FDE7F3',
    isSystem: false,
  },
  {
    key: 'sunset',
    name: 'Sunset',
    color1: '#FFF6EC',
    color2: '#FFFAF4',
    color3: '#F7D1A9',
    color4: '#A8552A',
    color5: '#4A2A1A',
    lightText: '#4A2A1A',
    darkText: '#FFE7D1',
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
