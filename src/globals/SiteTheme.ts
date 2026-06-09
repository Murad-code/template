import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { TYPOGRAPHY_FONT_OPTIONS } from '@/config/typographyFonts'

const colorField = (name: string, label: string, description?: string) => ({
  name,
  type: 'text' as const,
  label,
  admin: {
    components: {
      Field: '@/components/admin/ColorPickerField#ColorPickerField',
    },
    ...(description ? { description } : {}),
  },
})

const revalidateSiteThemeTag = () => {
  try {
    revalidateTag('global_site-theme')
  } catch {
    // Ignore when running outside Next.js request/render context (e.g. CLI scripts).
  }
}

const generateSiteThemePreviewPath = () => {
  const params = new URLSearchParams({
    slug: 'home',
    collection: 'pages',
    path: '/',
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `/next/preview?${params.toString()}`
}

export const SiteTheme: GlobalConfig = {
  slug: 'site-theme',
  admin: {
    livePreview: {
      url: () => generateSiteThemePreviewPath(),
    },
    preview: () => generateSiteThemePreviewPath(),
    description:
      'Set your site palette from saved palettes, or use a one-off custom palette. A protected default palette is always available as fallback.',
    group: 'Design',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'typography',
      type: 'group',
      admin: {
        description:
          'Choose brand font roles. Body controls default text, heading controls H1-H6, and mono controls labels/prices using font-mono.',
      },
      fields: [
        {
          name: 'bodyFont',
          type: 'select',
          required: true,
          defaultValue: 'geist-sans',
          options: TYPOGRAPHY_FONT_OPTIONS,
          label: 'Body font',
          admin: {
            width: '100%',
            components: {
              Field: '@/components/admin/TypographyFontSelectField#TypographyFontSelectField',
            },
          },
        },
        {
          name: 'headingFont',
          type: 'select',
          required: true,
          defaultValue: 'geist-sans',
          options: TYPOGRAPHY_FONT_OPTIONS,
          label: 'Heading font',
          admin: {
            width: '100%',
            components: {
              Field: '@/components/admin/TypographyFontSelectField#TypographyFontSelectField',
            },
          },
        },
        {
          name: 'monoFont',
          type: 'select',
          required: true,
          defaultValue: 'geist-mono',
          options: TYPOGRAPHY_FONT_OPTIONS,
          label: 'Mono / utility font',
          admin: {
            width: '100%',
            components: {
              Field: '@/components/admin/TypographyFontSelectField#TypographyFontSelectField',
            },
          },
        },
      ],
    },
    {
      name: 'paletteMode',
      type: 'select',
      defaultValue: 'palette',
      options: [
        { label: 'Palette', value: 'palette' },
        { label: 'One-off custom palette', value: 'custom' },
      ],
      required: true,
      admin: {
        description: 'Choose how this site should get its palette.',
      },
    },
    {
      name: 'palette',
      type: 'relationship',
      relationTo: 'theme-palettes',
      maxDepth: 1,
      label: 'Palette',
      admin: {
        condition: (_, siblingData) => !siblingData?.paletteMode || siblingData?.paletteMode === 'palette',
        description: "Select a palette. Create or remove palettes in the 'Theme Palettes' collection.",
        components: {
          Field: '@/components/admin/PaletteRelationshipField#PaletteRelationshipField',
        },
      },
    },
    {
      name: 'darkPalette',
      type: 'relationship',
      relationTo: 'theme-palettes',
      maxDepth: 1,
      label: 'Dark mode palette override (optional)',
      admin: {
        description:
          'Optional: choose a different palette for dark mode only. If empty, dark mode uses the main selected palette.',
        components: {
          Field: '@/components/admin/PaletteRelationshipField#PaletteRelationshipField',
        },
      },
    },
    {
      name: 'palettePreview',
      type: 'ui',
      admin: {
        condition: (_, siblingData) => !siblingData?.paletteMode || siblingData?.paletteMode === 'palette',
        components: {
          Field: '@/components/admin/PaletteSelectionPreview#PaletteSelectionPreview',
        },
      },
    },
    {
      name: 'paletteHelp',
      type: 'ui',
      admin: {
        condition: (_, siblingData) => !siblingData?.paletteMode || siblingData?.paletteMode === 'palette',
        components: {
          Field: '@/components/admin/PaletteHelp#PaletteHelp',
        },
      },
    },
    {
      name: 'customPalette',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.paletteMode === 'custom',
      },
      fields: [
        {
          type: 'row',
          fields: [
            colorField('color1', 'Color 1 (light background)'),
            colorField('color2', 'Color 2 (light card)'),
            colorField('color3', 'Color 3 (border / accent)'),
            colorField('color4', 'Color 4 (dark card)'),
            colorField('color5', 'Color 5 (dark background)'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField(
              'lightText',
              'Light mode text color',
              'Used for hero headings and body in light mode.',
            ),
            colorField(
              'darkText',
              'Dark mode text color',
              'Used for hero headings and body in dark mode.',
            ),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateSiteThemeTag()
      },
    ],
  },
}
