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

/**
 * The palettes offered in the admin.
 *
 * Each is five colours plus a light and a dark text colour, and
 * `deriveTokens` in src/config/siteTheme.ts turns them into the full token
 * set (see docs/frontend-ui-system.md):
 *
 *   color1  light page        color2  light panel
 *   color3  the brand mid-tone: accents, hairlines, the dark-mode button
 *   color4  the brand deep tone: the light-mode button, the dark-mode panel
 *   color5  dark page
 *
 * So `color3` and `color4` are the two that carry the brand, and they are
 * deliberately hued rather than grey — a desaturated `color3` leaves accents
 * and dark-mode buttons looking muddy.
 *
 * Every combination here clears AA for body text, button labels, secondary
 * text and the focus ring in both modes. `assertPaletteContrast` enforces the
 * input side of that on save; tests/int/theme-token-derivation.int.spec.ts
 * covers the derived side. Re-check both if you change a value.
 */
export const THEME_PALETTE_LIBRARY: ThemePaletteSeed[] = [
  // The fallback: no hue of its own, so it suits any business and never
  // fights a logo.
  {
    key: 'default',
    name: 'Neutral Studio',
    color1: '#FFFFFF',
    color2: '#F4F5F7',
    color3: '#C6CCD6',
    color4: '#1B2027',
    color5: '#0F1216',
    lightText: '#14171C',
    darkText: '#F6F7F9',
    isSystem: true,
  },
  // Professional services: deep navy reads as considered rather than cold.
  {
    key: 'porcelain-blue',
    name: 'Harbour Navy',
    color1: '#FAFBFD',
    color2: '#EEF2F8',
    color3: '#9FB6D1',
    color4: '#1B2A42',
    color5: '#0C1422',
    lightText: '#141D2B',
    darkText: '#EAF0F9',
    isSystem: false,
  },
  // Food, print and anything that wants to feel like paper.
  {
    key: 'warm-ivory',
    name: 'Warm Ivory',
    color1: '#FDFBF7',
    color2: '#F4EFE6',
    color3: '#CDB593',
    color4: '#2C241B',
    color5: '#15110C',
    lightText: '#241D15',
    darkText: '#F7F1E7',
    isSystem: false,
  },
  // Wellbeing, garden trades, anything with a natural product.
  {
    key: 'sage-stone',
    name: 'Sage Stone',
    color1: '#F8FAF8',
    color2: '#EDF2EC',
    color3: '#9AB096',
    color4: '#1F2C22',
    color5: '#101810',
    lightText: '#1B241D',
    darkText: '#EBF3EA',
    isSystem: false,
  },
  // Cool grey carrying one decisive warm accent: workshops, trades, studios.
  {
    key: 'fog-slate',
    name: 'Graphite Amber',
    color1: '#FBFBFC',
    color2: '#F1F2F4',
    color3: '#D9A552',
    color4: '#22262C',
    color5: '#111419',
    lightText: '#16191E',
    darkText: '#F5F6F8',
    isSystem: false,
  },
  // Roasters, bakeries, leather and wood: warm throughout.
  {
    key: 'charcoal-copper',
    name: 'Charcoal Copper',
    color1: '#FBF9F7',
    color2: '#F1EBE4',
    color3: '#C49A72',
    color4: '#2F2219',
    color5: '#180F0A',
    lightText: '#241A13',
    darkText: '#F9EDE2',
    isSystem: false,
  },
  // Salons and florists: soft without turning pastel.
  {
    key: 'plum-smoke',
    name: 'Plum Smoke',
    color1: '#FCFAFD',
    color2: '#F2EDF6',
    color3: '#B29CC2',
    color4: '#2C2436',
    color5: '#150F1B',
    lightText: '#231B2B',
    darkText: '#F2EAF8',
    isSystem: false,
  },
  // Clinics and coastal trades: clean, slightly cold, calm.
  {
    key: 'ink-cyan',
    name: 'Harbour Teal',
    color1: '#F7FBFC',
    color2: '#E8F1F3',
    color3: '#7FAEBD',
    color4: '#1A3038',
    color5: '#0B1519',
    lightText: '#16262D',
    darkText: '#E7F4F8',
    isSystem: false,
  },
  // Wine, butchery, barbers: the deepest of the set.
  {
    key: 'oxblood-linen',
    name: 'Oxblood Linen',
    color1: '#FCFAF9',
    color2: '#F3ECEA',
    color3: '#C08E8A',
    color4: '#3A1E1F',
    color5: '#1C0E0F',
    lightText: '#2A1718',
    darkText: '#F8EBE9',
    isSystem: false,
  },
  // Outdoor and craft: bone paper against a forest green.
  {
    key: 'forest-bone',
    name: 'Forest Bone',
    color1: '#FAFAF6',
    color2: '#EFF0E7',
    color3: '#94A982',
    color4: '#1E2A1C',
    color5: '#0F160E',
    lightText: '#1A231A',
    darkText: '#EDF2E8',
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

  const defaultPalette =
    docs.find((palette) => palette.key === DEFAULT_THEME_PALETTE_KEY) || docs[0]
  return { defaultPalette, docs }
}
