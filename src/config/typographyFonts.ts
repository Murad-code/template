export type TypographyRole = 'body' | 'heading' | 'mono'

export type TypographyFontValue =
  | 'geist-sans'
  | 'inter'
  | 'source-sans-3'
  | 'nunito-sans'
  | 'space-grotesk'
  | 'montserrat'
  | 'system-sans'
  | 'playfair-display'
  | 'lora'
  | 'merriweather'
  | 'dm-serif-display'
  | 'system-serif'
  | 'geist-mono'
  | 'jetbrains-mono'
  | 'fira-code'
  | 'ibm-plex-mono'
  | 'source-code-pro'
  | 'roboto-mono'
  | 'system-mono'

export type TypographyFontDefinition = {
  value: TypographyFontValue
  label: string
  family: 'sans' | 'serif' | 'mono' | 'system'
  typicalRoles: TypographyRole[]
}

export const TYPOGRAPHY_FONT_DEFINITIONS: TypographyFontDefinition[] = [
  { value: 'geist-sans', label: 'Geist Sans', family: 'sans', typicalRoles: ['body', 'heading'] },
  { value: 'inter', label: 'Inter', family: 'sans', typicalRoles: ['body', 'heading'] },
  { value: 'source-sans-3', label: 'Source Sans 3', family: 'sans', typicalRoles: ['body'] },
  { value: 'nunito-sans', label: 'Nunito Sans', family: 'sans', typicalRoles: ['body'] },
  { value: 'space-grotesk', label: 'Space Grotesk', family: 'sans', typicalRoles: ['heading'] },
  { value: 'montserrat', label: 'Montserrat', family: 'sans', typicalRoles: ['heading'] },
  {
    value: 'system-sans',
    label: 'System Sans',
    family: 'system',
    typicalRoles: ['body', 'heading'],
  },
  {
    value: 'playfair-display',
    label: 'Playfair Display',
    family: 'serif',
    typicalRoles: ['heading'],
  },
  { value: 'lora', label: 'Lora', family: 'serif', typicalRoles: ['body', 'heading'] },
  { value: 'merriweather', label: 'Merriweather', family: 'serif', typicalRoles: ['body'] },
  {
    value: 'dm-serif-display',
    label: 'DM Serif Display',
    family: 'serif',
    typicalRoles: ['heading'],
  },
  {
    value: 'system-serif',
    label: 'System Serif',
    family: 'system',
    typicalRoles: ['body', 'heading'],
  },
  { value: 'geist-mono', label: 'Geist Mono', family: 'mono', typicalRoles: ['mono'] },
  { value: 'jetbrains-mono', label: 'JetBrains Mono', family: 'mono', typicalRoles: ['mono'] },
  { value: 'fira-code', label: 'Fira Code', family: 'mono', typicalRoles: ['mono'] },
  { value: 'ibm-plex-mono', label: 'IBM Plex Mono', family: 'mono', typicalRoles: ['mono'] },
  { value: 'source-code-pro', label: 'Source Code Pro', family: 'mono', typicalRoles: ['mono'] },
  { value: 'roboto-mono', label: 'Roboto Mono', family: 'mono', typicalRoles: ['mono'] },
  { value: 'system-mono', label: 'System Mono', family: 'system', typicalRoles: ['mono'] },
]

export const TYPOGRAPHY_FONT_OPTIONS = TYPOGRAPHY_FONT_DEFINITIONS.map((font) => ({
  label: font.label,
  value: font.value,
}))

export type TypographyPairing = {
  key: string
  label: string
  description: string
  bodyFont: TypographyFontValue
  headingFont: TypographyFontValue
  monoFont: TypographyFontValue
}

/**
 * Known-good combinations for the three font roles.
 *
 * The admin exposes the roles as three independent pickers, which is right —
 * but three dropdowns of eighteen faces is a lot of rope. These are the
 * pairings the design system was drawn against; `DEFAULT_TYPOGRAPHY_PAIRING`
 * is what a fresh install gets.
 *
 * The rule behind all of them: one face with enough character to carry a
 * display heading, one quiet face that stays readable at 16px over long
 * paragraphs, and a mono with a clear figure set for the specification line,
 * where prices and durations have to line up.
 */
export const TYPOGRAPHY_PAIRINGS: TypographyPairing[] = [
  {
    key: 'studio',
    label: 'Studio',
    description:
      'Geometric headings over a neutral UI face. Reads modern without reading like a software product.',
    headingFont: 'space-grotesk',
    bodyFont: 'inter',
    monoFont: 'jetbrains-mono',
  },
  {
    key: 'editorial',
    label: 'Editorial',
    description:
      'High-contrast serif headlines over a humanist sans. For businesses selling provenance: food, wine, craft.',
    headingFont: 'playfair-display',
    bodyFont: 'source-sans-3',
    monoFont: 'ibm-plex-mono',
  },
  {
    key: 'grounded',
    label: 'Grounded',
    description:
      'A serif that works at both heading and body size. Warm and unhurried; suits wellbeing and clinics.',
    headingFont: 'lora',
    bodyFont: 'lora',
    monoFont: 'ibm-plex-mono',
  },
  {
    key: 'direct',
    label: 'Direct',
    description:
      'One sans throughout, separated by weight and size alone. The quietest option, and the safest with a busy logo.',
    headingFont: 'geist-sans',
    bodyFont: 'geist-sans',
    monoFont: 'geist-mono',
  },
]

export const DEFAULT_TYPOGRAPHY_PAIRING = TYPOGRAPHY_PAIRINGS[0]!
