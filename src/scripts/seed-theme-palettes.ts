import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import { upsertThemePalettes } from '@/utilities/themePalettes'
import { DEFAULT_TYPOGRAPHY_PAIRING } from '@/config/typographyFonts'
import type { SiteTheme } from '@/payload-types'

async function run() {
  const payload = await getPayload({ config })
  const { defaultPalette, docs } = await upsertThemePalettes(payload)

  const currentSiteTheme = await payload.findGlobal({
    slug: 'site-theme',
    depth: 0,
  })

  const hasPalette = Boolean(currentSiteTheme?.palette)
  const hasTypography = Boolean(currentSiteTheme?.typography?.headingFont)

  // Only fill in what the site has not chosen for itself: re-running the seed
  // to pick up new palettes should never overwrite an editor's branding.
  const data: Partial<SiteTheme> = {}

  if (!hasPalette && defaultPalette) {
    data.paletteMode = 'palette'
    data.palette = defaultPalette.id
  }

  if (!hasTypography) {
    data.typography = {
      bodyFont: DEFAULT_TYPOGRAPHY_PAIRING.bodyFont,
      headingFont: DEFAULT_TYPOGRAPHY_PAIRING.headingFont,
      monoFont: DEFAULT_TYPOGRAPHY_PAIRING.monoFont,
    }
  }

  if (Object.keys(data).length) {
    await payload.updateGlobal({ slug: 'site-theme', data, depth: 0 })
  }

  payload.logger.info(
    [
      `Theme palette sync complete: ${docs.length} palettes available.`,
      !hasPalette ? ` Assigned "${defaultPalette?.name}".` : '',
      !hasTypography ? ` Set the ${DEFAULT_TYPOGRAPHY_PAIRING.label} font pairing.` : '',
    ].join(''),
  )
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
