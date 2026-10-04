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
 * All of them set heading and body to the same family. Mixing a display face
 * with a separate body face only works when the two were drawn to go
 * together, and across eighteen options in three dropdowns it mostly does
 * not: a page ends up with a geometric heading, a neutral paragraph and a
 * monospace price, which reads as three websites at once.
 *
 * Hierarchy here comes from size, weight and spacing — the type scale in
 * globals.css — so one family is enough to carry a page.
 *
 * The mono role is now only reachable by the code block. Prices, durations
 * and the specification line use the body face with `tabular-figures`, which
 * lines figures up without changing typeface.
 */
export const TYPOGRAPHY_PAIRINGS: TypographyPairing[] = [
  {
    key: 'inter',
    label: 'Inter',
    description:
      'The default. Neutral, contemporary and highly legible from captions to display sizes. Suits any business and never competes with a logo.',
    headingFont: 'inter',
    bodyFont: 'inter',
    monoFont: 'geist-mono',
  },
  {
    key: 'geist',
    label: 'Geist',
    description:
      'A touch more character than Inter in the figures and the lowercase g. Loaded locally, so it costs no extra network request.',
    headingFont: 'geist-sans',
    bodyFont: 'geist-sans',
    monoFont: 'geist-mono',
  },
  {
    key: 'source',
    label: 'Source Sans',
    description:
      'Humanist rather than geometric: a little warmer, and comfortable over long paragraphs. For businesses that do a lot of writing.',
    headingFont: 'source-sans-3',
    bodyFont: 'source-sans-3',
    monoFont: 'ibm-plex-mono',
  },
  {
    key: 'lora',
    label: 'Lora',
    description:
      'A serif throughout. The one option that reads traditional rather than contemporary; suits provenance, law and wellbeing.',
    headingFont: 'lora',
    bodyFont: 'lora',
    monoFont: 'ibm-plex-mono',
  },
]

export const DEFAULT_TYPOGRAPHY_PAIRING = TYPOGRAPHY_PAIRINGS[0]!
