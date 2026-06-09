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
  { value: 'system-sans', label: 'System Sans', family: 'system', typicalRoles: ['body', 'heading'] },
  { value: 'playfair-display', label: 'Playfair Display', family: 'serif', typicalRoles: ['heading'] },
  { value: 'lora', label: 'Lora', family: 'serif', typicalRoles: ['body', 'heading'] },
  { value: 'merriweather', label: 'Merriweather', family: 'serif', typicalRoles: ['body'] },
  { value: 'dm-serif-display', label: 'DM Serif Display', family: 'serif', typicalRoles: ['heading'] },
  { value: 'system-serif', label: 'System Serif', family: 'system', typicalRoles: ['body', 'heading'] },
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
