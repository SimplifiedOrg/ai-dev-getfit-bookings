import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeTestDb } from './helpers/makeTestDb.js'
import { cancelBooking, createBooking, getBookingsForMember } from '../server/services/bookings.js'

// Wed 4 Nov, 10am. Saturday 9am Spin is on Sat 7 Nov and full.
const NOW = new Date(2026, 10, 4, 10, 0)

function findSession(data, classTypeId, day, hours) {
  return data.sessions.find(
    (s) => s.classTypeId === classTypeId && new Date(s.startsAt).getTime() === new Date(2026, 10, day, hours).getTime()
  )
}

function catchError(fn) {
  try {
    fn()
  } catch (err) {
    return err
  }
  throw new Error('Expected an error')
}

describe('bookings service', () => {
  let db
  let data

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    db = makeTestDb()
    data = db.read()
  })

  afterEach(() => {
    db.cleanup()
    vi.useRealTimers()
  })

  it('saves a new booking', () => {
    const thursdayHiit = findSession(data, 'ct_hiit', 5, 18)
    const booking = createBooking('m_alex', thursdayHiit.id)

    const saved = db.read().bookings.find((b) => b.id === booking.id)
    expect(saved).toMatchObject({ memberId: 'm_alex', sessionId: thursdayHiit.id, status: 'BOOKED' })
  })

  it('refuses to book a full class', () => {
    const saturdaySpin = findSession(data, 'ct_spin', 7, 9)
    const err = catchError(() => createBooking('m_alex', saturdaySpin.id))

    expect(err.status).toBe(409)
    expect(err.message).toBe('This class is full.')
  })

  it('cancels a booking', () => {
    const saturdaySpin = findSession(data, 'ct_spin', 7, 9)
    const jordans = data.bookings.find((b) => b.memberId === 'm_jordan' && b.sessionId === saturdaySpin.id)

    cancelBooking('m_jordan', jordans.id)

    expect(db.read().bookings.find((b) => b.id === jordans.id).status).toBe('CANCELLED')
  })

  it('refuses to cancel within 2 hours of the start', () => {
    const saturdaySpin = findSession(data, 'ct_spin', 7, 9)
    const jordans = data.bookings.find((b) => b.memberId === 'm_jordan' && b.sessionId === saturdaySpin.id)
    vi.setSystemTime(new Date(2026, 10, 7, 8, 0))

    const err = catchError(() => cancelBooking('m_jordan', jordans.id))

    expect(err.status).toBe(409)
    expect(err.message).toBe("You can't cancel within 2 hours of the class starting.")
  })

  it("refuses to cancel someone else's booking", () => {
    const saturdaySpin = findSession(data, 'ct_spin', 7, 9)
    const jordans = data.bookings.find((b) => b.memberId === 'm_jordan' && b.sessionId === saturdaySpin.id)

    const err = catchError(() => cancelBooking('m_alex', jordans.id))

    expect(err.status).toBe(403)
  })

  it("reports a casual member's weekly usage", () => {
    const { weeklyUsage } = getBookingsForMember('m_alex')

    expect(weeklyUsage).toEqual({ membershipTier: 'CASUAL', limit: 3, thisWeek: 1, nextWeek: 0 })
  })
})
