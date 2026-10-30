import crypto from 'node:crypto'
import { readDb, writeDb } from '../db.js'
import { AppError } from '../errors.js'
import { CASUAL_WEEKLY_LIMIT, canBook, canCancel } from '../rules/bookingRules.js'
import { addDays, isSameWeek } from '../../lib/dates.js'
import { toApiSession } from './classes.js'

export function createBooking(memberId, sessionId) {
  const db = readDb()
  const now = new Date()

  const member = db.members.find((m) => m.id === memberId)
  if (!member) throw new AppError(404, 'Member not found.')

  const session = db.sessions.find((s) => s.id === sessionId)
  if (!session) throw new AppError(404, 'Class not found.')

  const booked = db.bookings.filter((b) => b.status === 'BOOKED')
  const bookedCount = booked.filter((b) => b.sessionId === sessionId).length
  const memberBookedSessions = booked
    .filter((b) => b.memberId === memberId)
    .map((b) => db.sessions.find((s) => s.id === b.sessionId))

  const result = canBook(member, session, { bookedCount, memberBookedSessions, now })
  if (!result.ok) {
    throw new AppError(409, result.message)
  }

  const booking = {
    id: crypto.randomUUID(),
    memberId,
    sessionId,
    status: 'BOOKED',
    createdAt: now.toISOString(),
  }
  db.bookings.push(booking)
  writeDb(db)

  return booking
}

// function formatBooking(booking, session) {
//   const start = new Date(session.startsAt)
//   return {
//     id: booking.id,
//     title: session.classTypeId.replace('ct_', '').toUpperCase(),
//     date: start.toDateString(),
//     time: start.toLocaleTimeString(),
//     cancelled: booking.status == 'CANCELLED',
//   }
// }

export function cancelBooking(memberId, bookingId) {
  const db = readDb()
  const booking = db.bookings.find((b) => b.id === bookingId)
  console.log('here')

  if (!booking) throw new AppError(404, 'Booking not found.')
  if (booking.memberId !== memberId) {
    throw new AppError(403, 'You can only cancel your own bookings.')
  }

  const session = db.sessions.find((s) => s.id === booking.sessionId)
  const result = canCancel(booking, session, new Date())
  if (!result.ok) throw new AppError(409, result.message)

  booking.status = 'CANCELLED'
  writeDb(db)
  return booking
}

export function getBookingsForMember(memberId) {
  const db = readDb()
  const now = new Date()

  const bookings = db.bookings
    .filter((b) => b.memberId === memberId)
    .map((b) => {
      const session = db.sessions.find((s) => s.id === b.sessionId)
      return {
        id: b.id,
        status: b.status,
        createdAt: b.createdAt,
        session: toApiSession(db, session, memberId, now),
      }
    })

  const byStart = (a, b) => new Date(a.session.startsAt) - new Date(b.session.startsAt)

  const upcoming = bookings.filter((b) => b.status === 'BOOKED' && !b.session.hasStarted).sort(byStart)
  // everything else, newest first
  const past = bookings
    .filter((b) => !upcoming.includes(b))
    .sort((a, b) => byStart(b, a))

  return { upcoming, past, weeklyUsage: getWeeklyUsage(db, memberId, bookings, now) }
}

// Same count the casual weekly limit uses: BOOKED bookings in that Mon–Sun week
function getWeeklyUsage(db, memberId, bookings, now) {
  const member = db.members.find((m) => m.id === memberId)
  const booked = bookings.filter((b) => b.status === 'BOOKED')
  const countForWeek = (date) => booked.filter((b) => isSameWeek(b.session.startsAt, date)).length

  return {
    membershipTier: member.membershipTier,
    limit: member.membershipTier === 'CASUAL' ? CASUAL_WEEKLY_LIMIT : null,
    thisWeek: countForWeek(now),
    nextWeek: countForWeek(addDays(now, 7)),
  }
}

export function getAttendees(sessionId) {
  const db = readDb()
  if (!db.sessions.some((s) => s.id === sessionId)) {
    throw new AppError(404, 'Class not found.')
  }

  return db.bookings
    .filter((b) => b.sessionId === sessionId && b.status === 'BOOKED')
    .map((b) => {
      const member = db.members.find((m) => m.id === b.memberId)
      return {
        bookingId: b.id,
        memberId: member.id,
        name: member.name,
        email: member.email,
        membershipTier: member.membershipTier,
      }
    })
}
