// Builds a .ics file so members can add a class to their own calendar

// e.g. 20261106T220000Z
function toIcsDate(date) {
  return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function buildIcs(session) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GetFit//Bookings//EN',
    'BEGIN:VEVENT',
    `UID:${session.id}@getfit.test`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(session.startsAt)}`,
    `DTEND:${toIcsDate(session.endsAt)}`,
    `SUMMARY:${session.classType.name} at GetFit`,
    `LOCATION:GetFit ${session.studio}`,
    `DESCRIPTION:With ${session.instructor.name}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadIcs(session) {
  const blob = new Blob([buildIcs(session)], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `getfit-${session.classType.name.toLowerCase()}.ics`
  link.click()

  URL.revokeObjectURL(url)
}
