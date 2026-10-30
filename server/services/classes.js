import { readDb } from '../db.js'
import { AppError } from '../errors.js'
import { addDays, endsAt, startOfWeek } from '../../lib/dates.js'

const countBooked = (db, sessionId) =>
  db.bookings.filter((b) => b.sessionId === sessionId && b.status === 'BOOKED').length

// The shape every API response uses for a session
export const toApiSession = (db, session, memberId, now = new Date()) => {
  const bookedCount = countBooked(db, session.id)
  const myBooking = memberId
    ? db.bookings.find((b) => b.sessionId === session.id && b.memberId === memberId && b.status === 'BOOKED')
    : null

  return {
    ...session,
    classType: db.classTypes.find((t) => t.id === session.classTypeId),
    instructor: db.instructors.find((i) => i.id === session.instructorId),
    endsAt: endsAt(session.startsAt, session.durationMins).toISOString(),
    bookedCount,
    spotsLeft: Math.max(session.capacity - bookedCount, 0),
    hasStarted: new Date(session.startsAt) <= now,
    myBookingId: myBooking ? myBooking.id : null,
  }
}

export const listSessions = ({ week = 'this', memberId }) => {
  if (week !== 'this' && week !== 'next') {
    throw new AppError(400, 'Week must be "this" or "next".')
  }

  const db = readDb()
  const now = new Date()
  const weekStart = addDays(startOfWeek(now), week === 'next' ? 7 : 0)
  const weekEnd = addDays(weekStart, 7)

  const sessions = db.sessions
    .filter((s) => new Date(s.startsAt) >= weekStart && new Date(s.startsAt) < weekEnd)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
    .map((s) => toApiSession(db, s, memberId, now))

  return { weekStart: weekStart.toISOString(), sessions }
}

export const getSession = (id, memberId) => {
  const db = readDb()
  const session = db.sessions.find((s) => s.id === id)
  if (!session) throw new AppError(404, 'Class not found.')
  return toApiSession(db, session, memberId)
}
