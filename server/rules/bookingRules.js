import { endsAt, hoursUntil, isSameWeek, overlaps } from '../../lib/dates.js'

export const CANCEL_CUTOFF_HOURS = 2
export const CASUAL_WEEKLY_LIMIT = 3

// context: { bookedCount, memberBookedSessions, now }
export function canBook(member, session, context) {
  const { bookedCount, memberBookedSessions, now } = context

  if (new Date(session.startsAt) <= new Date(now)) {
    return { ok: false, message: 'This class has already started.' }
  }

  if (bookedCount >= session.capacity) {
    return { ok: false, message: 'This class is full.' }
  }

  if (member.membershipTier === 'CASUAL') {
    const bookedThisWeek = memberBookedSessions.filter((s) => isSameWeek(s.startsAt, session.startsAt))
    if (bookedThisWeek.length >= CASUAL_WEEKLY_LIMIT) {
      return { ok: false, message: 'Casual members can book 3 classes a week.' }
    }
  }

  // Also catches booking the same class twice
  const sessionEnd = endsAt(session.startsAt, session.durationMins)
  const clash = memberBookedSessions.some((s) =>
    overlaps(s.startsAt, endsAt(s.startsAt, s.durationMins), session.startsAt, sessionEnd)
  )
  if (clash) {
    return { ok: false, message: 'You already have a booking at this time.' }
  }

  return { ok: true }
}

export function canCancel(booking, session, now) {
  if (booking.status === 'CANCELLED') {
    return { ok: false, message: 'This booking is already cancelled.' }
  }

  if (hoursUntil(session.startsAt, now) < CANCEL_CUTOFF_HOURS) {
    return { ok: false, message: "You can't cancel within 2 hours of the class starting." }
  }

  return { ok: true }
}
