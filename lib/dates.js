// Plain date helpers, used in the browser and on the server.
// Everything is in the computer's local time.

const LOCALE = 'en-AU'

export function startOfWeek(date) {
  const d = new Date(date)
  const daysSinceMonday = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - daysSinceMonday)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameWeek(a, b) {
  return startOfWeek(a).getTime() === startOfWeek(b).getTime()
}

export function endsAt(startsAt, durationMins) {
  return new Date(new Date(startsAt).getTime() + durationMins * 60 * 1000)
}

// Touching times (one ends exactly when the other starts) don't overlap
export function overlaps(startA, endA, startB, endB) {
  return new Date(startA) < new Date(endB) && new Date(startB) < new Date(endA)
}

export function hoursUntil(date, now) {
  return (new Date(date) - new Date(now)) / (60 * 60 * 1000)
}

// e.g. "Sat 7 Nov"
export function formatDay(date) {
  const d = new Date(date)
  const weekday = d.toLocaleDateString(LOCALE, { weekday: 'short' })
  const month = d.toLocaleDateString(LOCALE, { month: 'short' })
  return `${weekday} ${d.getDate()} ${month}`
}

// e.g. "9:00 am"
export function formatTime(date) {
  return new Date(date)
    .toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export function formatTimeRange(start, end) {
  return `${formatTime(start)} – ${formatTime(end)}`
}

// e.g. "2–8 Nov" or "30 Nov – 6 Dec"
export function formatWeekRange(weekStart) {
  const start = new Date(weekStart)
  const end = addDays(start, 6)
  const startMonth = start.toLocaleDateString(LOCALE, { month: 'short' })
  const endMonth = end.toLocaleDateString(LOCALE, { month: 'short' })
  if (startMonth === endMonth) {
    return `${start.getDate()}–${end.getDate()} ${endMonth}`
  }
  return `${start.getDate()} ${startMonth} – ${end.getDate()} ${endMonth}`
}
