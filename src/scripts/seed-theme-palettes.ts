import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import { upsertThemePalettes } from '@/utilities/themePalettes'
import type { SiteTheme } from '@/payload-types'

async function run() {
  const payload = await getPayload({ config })
  const { defaultPalette, docs } = await upsertThemePalettes(payload)

  const currentSiteTheme = await payload.findGlobal({
    slug: 'site-theme',
    depth: 0,
  })

  const hasPalette = Boolean(currentSiteTheme?.palette)

  if (!hasPalette && defaultPalette) {
    await payload.updateGlobal({
      slug: 'site-theme',
      data: {
        paletteMode: 'palette',
        palette: defaultPalette.id,
      } as Partial<SiteTheme>,
      depth: 0,
    })
  }

  payload.logger.info(
    `Theme palette sync complete: ${docs.length} palettes available.${hasPalette ? '' : ' Assigned default palette to site theme.'}`,
  )
}

void run()
