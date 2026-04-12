/**
 * Canonical calendar date as `yyyy-mm-dd` for storage, DB queries, URL/query params,
 * Stripe metadata, and machine-readable attributes (e.g. `<time dateTime>`).
 */
export function toDateOnlyString(input: string | Date | null | undefined): string {
  if (input == null || input === '') return ''
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return ''
    return input.toISOString().slice(0, 10)
  }
  const s = String(input).trim()
  const lead = s.match(/^(\d{4}-\d{2}-\d{2})/)
  if (lead) return lead[1]
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10)
}

/** Human-facing date: `dd-mm-yyyy` (UK-style day first). Use for UI and emails only. */
export function formatDateDisplayDMY(input: string | Date | null | undefined): string {
  const ymd = toDateOnlyString(input)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd
  const [y, m, d] = ymd.split('-')
  return `${d}-${m}-${y}`
}
