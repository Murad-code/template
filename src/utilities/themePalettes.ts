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
    name: 'Neutral Studio',
    color1: '#FFFFFF',
    color2: '#F6F7F9',
    color3: '#D3D9E2',
    color4: '#1F2937',
    color5: '#111827',
    lightText: '#111827',
    darkText: '#F9FAFB',
    isSystem: true,
  },
  {
    key: 'porcelain-blue',
    name: 'Porcelain Blue',
    color1: '#FAFCFF',
    color2: '#F1F5FA',
    color3: '#B8C8DD',
    color4: '#253446',
    color5: '#101A26',
    lightText: '#142033',
    darkText: '#EAF1FB',
    isSystem: false,
  },
  {
    key: 'warm-ivory',
    name: 'Warm Ivory',
    color1: '#FDFBF8',
    color2: '#F5F1EB',
    color3: '#D8C4A9',
    color4: '#30261F',
    color5: '#17120E',
    lightText: '#231B16',
    darkText: '#F8F1E8',
    isSystem: false,
  },
  {
    key: 'sage-stone',
    name: 'Sage Stone',
    color1: '#F8FAF8',
    color2: '#EFF3EE',
    color3: '#A7B9A4',
    color4: '#243027',
    color5: '#111A14',
    lightText: '#1D261F',
    darkText: '#EAF3EC',
    isSystem: false,
  },
  {
    key: 'fog-slate',
    name: 'Fog Slate',
    color1: '#F8F9FB',
    color2: '#EEF1F5',
    color3: '#BFC9D8',
    color4: '#283446',
    color5: '#131B26',
    lightText: '#1A2333',
    darkText: '#ECF2FA',
    isSystem: false,
  },
  {
    key: 'charcoal-copper',
    name: 'Charcoal Copper',
    color1: '#FBF9F7',
    color2: '#F1ECE6',
    color3: '#C7A17D',
    color4: '#32251D',
    color5: '#19110D',
    lightText: '#251B15',
    darkText: '#FAEEE3',
    isSystem: false,
  },
  {
    key: 'plum-smoke',
    name: 'Plum Smoke',
    color1: '#FCFAFD',
    color2: '#F3EFF6',
    color3: '#BDA7C9',
    color4: '#31283A',
    color5: '#18131D',
    lightText: '#251C2D',
    darkText: '#F3ECF9',
    isSystem: false,
  },
  {
    key: 'ink-cyan',
    name: 'Ink Cyan',
    color1: '#F7FBFC',
    color2: '#EAF2F5',
    color3: '#8EB8C5',
    color4: '#213441',
    color5: '#101A22',
    lightText: '#192833',
    darkText: '#E9F5FA',
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
