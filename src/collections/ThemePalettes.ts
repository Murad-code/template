import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook, CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { APIError } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import {
  normalizeAndValidatePalette,
  normalizeHexColor,
  type PaletteInput,
} from '@/utilities/themePaletteValidation'

const colorField = (
  name: string,
  label: string,
  description?: string,
  options?: {
    listCell?: string
  },
) => ({
  name,
  type: 'text' as const,
  label,
  validate: (value: unknown) => {
    const normalized = normalizeHexColor(typeof value === 'string' ? value : null)
    if (!normalized) return `${label} must be a valid hex color (#RRGGBB).`
    return true
  },
  admin: {
    components: {
      Field: '@/components/admin/ColorPickerField#ColorPickerField',
      ...(options?.listCell ? { Cell: options.listCell } : {}),
    },
    ...(description ? { description } : {}),
  },
})

const revalidateSiteThemeTag = () => {
  try {
    revalidateTag('global_site-theme', 'max')
  } catch {
    // Ignore when running outside Next.js request/render context (e.g. CLI seed scripts).
  }
}

export const ThemePalettes: CollectionConfig = {
  slug: 'theme-palettes',
  admin: {
    group: 'Design',
    useAsTitle: 'name',
    defaultColumns: ['name', 'color1', 'updatedAt'],
    description:
      'Create reusable custom palettes that appear in Site Theme dropdowns. The default system palette is protected and always available.',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Stable internal key for seeding and fallback behavior.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'paletteFormPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/ThemePaletteFormPreview#ThemePaletteFormPreview',
        },
      },
    },
    {
      name: 'isSystem',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description:
          'System palettes are managed by seed/backfill scripts. The default system palette is protected from deletion.',
      },
    },
    colorField('color1', 'Palette', 'Color 1 (light background)', {
      listCell: '@/components/admin/PaletteSwatchCell#PaletteSwatchCell',
    }),
    colorField('color2', 'Color 2', 'Color 2 (light card).'),
    colorField('color3', 'Color 3', 'Color 3 (border / accent).'),
    colorField('color4', 'Color 4', 'Color 4 (dark card).'),
    colorField('color5', 'Color 5', 'Color 5 (dark background).'),
    {
      type: 'row',
      fields: [
        colorField('lightText', 'Light mode text color'),
        colorField('darkText', 'Dark mode text color'),
      ],
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ req, operation, data, originalDoc }) => {
        const incomingData = (data ?? {}) as Record<string, unknown>
        const paletteID = originalDoc?.id
        const mergedPalette: PaletteInput = {
          color1: typeof incomingData.color1 === 'string' ? incomingData.color1 : originalDoc?.color1,
          color2: typeof incomingData.color2 === 'string' ? incomingData.color2 : originalDoc?.color2,
          color3: typeof incomingData.color3 === 'string' ? incomingData.color3 : originalDoc?.color3,
          color4: typeof incomingData.color4 === 'string' ? incomingData.color4 : originalDoc?.color4,
          color5: typeof incomingData.color5 === 'string' ? incomingData.color5 : originalDoc?.color5,
          lightText:
            typeof incomingData.lightText === 'string' ? incomingData.lightText : originalDoc?.lightText,
          darkText: typeof incomingData.darkText === 'string' ? incomingData.darkText : originalDoc?.darkText,
        }
        let normalizedPalette
        try {
          normalizedPalette = normalizeAndValidatePalette(mergedPalette, 'Theme palette')
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Invalid palette configuration.'
          throw new APIError(message, 400)
        }
        incomingData.color1 = normalizedPalette.color1
        incomingData.color2 = normalizedPalette.color2
        incomingData.color3 = normalizedPalette.color3
        incomingData.color4 = normalizedPalette.color4
        incomingData.color5 = normalizedPalette.color5
        incomingData.lightText = normalizedPalette.lightText
        incomingData.darkText = normalizedPalette.darkText

        if (operation !== 'update' || !paletteID) return incomingData

        const hasAuthenticatedUser = Boolean(req.user)
        const existing = await req.payload.findByID({
          collection: 'theme-palettes',
          id: paletteID,
          depth: 0,
          // Enforce access checks for authenticated requests, but allow CLI/system seed scripts.
          overrideAccess: !hasAuthenticatedUser,
          req,
        })

        if (existing?.isSystem && existing?.key === 'default') {
          const incomingKey = typeof data?.key === 'string' ? data.key : existing.key
          const incomingIsSystem =
            typeof data?.isSystem === 'boolean' ? data.isSystem : Boolean(existing.isSystem)

          if (incomingKey !== 'default' || incomingIsSystem !== true) {
            throw new APIError('The default palette key/system flags are protected.', 400)
          }
        }

        return incomingData
      }) as CollectionBeforeChangeHook,
    ],
    beforeDelete: [
      (async ({ req, id }) => {
        if (!id) return

        const hasAuthenticatedUser = Boolean(req.user)
        const existing = await req.payload.findByID({
          collection: 'theme-palettes',
          id,
          depth: 0,
          // Enforce access checks for authenticated requests, but allow CLI/system seed scripts.
          overrideAccess: !hasAuthenticatedUser,
          req,
        })

        if (existing?.isSystem && existing?.key === 'default') {
          throw new APIError('The default palette is required and cannot be deleted.', 400)
        }
      }) as CollectionBeforeDeleteHook,
    ],
    afterChange: [
      () => {
        revalidateSiteThemeTag()
      },
    ],
    afterDelete: [
      () => {
        revalidateSiteThemeTag()
      },
    ],
  },
}
