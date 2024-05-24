// in miliseconds
const units: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function getRelativeTime(d1: Date, d2 = new Date()): string {
  const elapsed = d1.getTime() - d2.getTime()

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const [u, value] of Object.entries(units) as [
    Intl.RelativeTimeFormatUnit,
    number,
  ][]) {
    if (Math.abs(elapsed) > value || u == 'second')
      return rtf.format(Math.round(elapsed / value), u)
  }

  return ''
}

export function fromNow(seconds: number): Date {
  return new Date(new Date().getTime() + seconds * 1000)
}

export function from(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000)
}
