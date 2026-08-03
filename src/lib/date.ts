export function todayISO(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 10)
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export function isoDateOffset(daysAgo: number): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60_000)
  local.setUTCDate(local.getUTCDate() - daysAgo)
  return local.toISOString().slice(0, 10)
}

export function weekdayLabel(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'narrow' })
}

export function isSameMonth(iso: string, reference: Date = new Date()): boolean {
  const date = new Date(`${iso}T00:00:00`)
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth()
}
