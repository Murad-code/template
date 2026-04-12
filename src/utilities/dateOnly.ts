/**
 * Calendar day as `yyyy-mm-dd` for storage, queries, Stripe metadata, and `<time dateTime>`.
 *
 * - **Strings:** if the trimmed value starts with `YYYY-MM-DD`, that prefix is used (stable with the booking UI).
 * - **`Date` values:** uses **UTC** calendar components (`getUTC*`). This matches how `YYYY-MM-DD` is parsed in JS
 *   (UTC midnight) and avoids the common bug where `toISOString().slice(0, 10)` combined with local-midnight `Date`
 *   instances shifts the stored day relative to what the user picked.
 */
export function toDateOnlyString(input: string | Date | null | undefined): string {
  if (input == null || input === '') return ''
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return ''
    return ymdFromUtcCalendar(input)
  }
  const s = String(input).trim()
  const lead = s.match(/^(\d{4}-\d{2}-\d{2})/)
  if (lead) return lead[1]
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? s : ymdFromUtcCalendar(d)
}

function ymdFromUtcCalendar(d: Date): string {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Canonical `Date` for a civil calendar day in APIs/adapters (e.g. Postgres `timestamp`).
 * **UTC noon** avoids “local midnight” shifts when a `YYYY-MM-DD` string is coerced by the DB driver.
 */
export function dateOnlyToUtcNoonDate(ymd: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim())
  if (!m) {
    throw new Error(`dateOnlyToUtcNoonDate: expected yyyy-mm-dd, got: ${ymd}`)
  }
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0, 0))
}

/** Human-facing date: `dd-mm-yyyy` (UK-style day first). Use for UI and emails only. */
export function formatDateDisplayDMY(input: string | Date | null | undefined): string {
  const ymd = toDateOnlyString(input)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd
  const [y, m, d] = ymd.split('-')
  return `${d}-${m}-${y}`
}
