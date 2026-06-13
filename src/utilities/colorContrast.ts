function normalizeHex(input?: string | null): string | null {
  const value = input?.trim() || ''
  if (!value.startsWith('#')) return null

  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const chars = value.slice(1).split('')
    return `#${chars.map((char) => `${char}${char}`).join('')}`
  }

  return null
}

function srgbToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const normalized = normalizeHex(hex)
  if (!normalized) return 0

  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)

  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

export function getContrastRatio(foreground?: string | null, background?: string | null): number | null {
  const fg = normalizeHex(foreground)
  const bg = normalizeHex(background)
  if (!fg || !bg) return null

  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastBadge(ratio: number | null): { label: string; tone: 'good' | 'warn' | 'bad' } {
  if (ratio == null) return { label: 'Contrast N/A', tone: 'warn' }
  if (ratio >= 4.5) return { label: `Contrast AA (${ratio.toFixed(2)}:1)`, tone: 'good' }
  if (ratio >= 3) return { label: `Contrast large-text only (${ratio.toFixed(2)}:1)`, tone: 'warn' }
  return { label: `Contrast fail (${ratio.toFixed(2)}:1)`, tone: 'bad' }
}

export function getBestReadableText(background?: string | null): '#000000' | '#FFFFFF' {
  const blackRatio = getContrastRatio('#000000', background) ?? 0
  const whiteRatio = getContrastRatio('#FFFFFF', background) ?? 0
  return whiteRatio >= blackRatio ? '#FFFFFF' : '#000000'
}
