import { describe, expect, it } from 'vitest'
import { canBook, canCancel } from '../server/rules/bookingRules.js'

const now = new Date(2026, 10, 4, 10, 0) // Wed 4 Nov, 10am

const casual = { id: 'm_casual', membershipTier: 'CASUAL' }
const unlimited = { id: 'm_unlimited', membershipTier: 'UNLIMITED' }

function makeSession(day, hours, overrides = {}) {
  return {
    id: `ses_${day}_${hours}`,
    startsAt: new Date(2026, 10, day, hours, 0).toISOString(),
    durationMins: 45,
    capacity: 8,
    ...overrides,
  }
}

const thursday = makeSession(5, 18)
const context = (overrides = {}) => ({ bookedCount: 0, memberBookedSessions: [], now, ...overrides })

describe('canBook', () => {
  it('allows booking a class with spots', () => {
    expect(canBook(casual, thursday, context())).toEqual({ ok: true })
  })

  it("doesn't allow booking a class that has started", () => {
    const started = makeSession(4, 9)
    expect(canBook(casual, started, context())).toEqual({ ok: false, message: 'This class has already started.' })
  })

  it("doesn't allow booking a full class", () => {
    expect(canBook(casual, thursday, context({ bookedCount: 8 }))).toEqual({
      ok: false,
      message: 'This class is full.',
    })
  })

  it('allows booking the last spot', () => {
    expect(canBook(casual, thursday, context({ bookedCount: 7 })).ok).toBe(true)
  })

  it('lets casual members book a 3rd class in a week', () => {
    const booked = [makeSession(2, 9), makeSession(3, 9)]
    expect(canBook(casual, thursday, context({ memberBookedSessions: booked })).ok).toBe(true)
  })

  it("doesn't let casual members book a 4th class in a week", () => {
    const booked = [makeSession(2, 9), makeSession(3, 9), makeSession(6, 9)]
    expect(canBook(casual, thursday, context({ memberBookedSessions: booked }))).toEqual({
      ok: false,
      message: 'Casual members can book 3 classes a week.',
    })
  })

  it('has no weekly limit for unlimited members', () => {
    const booked = [makeSession(2, 9), makeSession(3, 9), makeSession(6, 9), makeSession(7, 9)]
    expect(canBook(unlimited, thursday, context({ memberBookedSessions: booked })).ok).toBe(true)
  })

  it("doesn't count cancelled bookings towards the weekly limit", () => {
    // memberBookedSessions only includes BOOKED bookings, so a cancelled one is left out
    const booked = [makeSession(2, 9), makeSession(3, 9)]
    expect(canBook(casual, thursday, context({ memberBookedSessions: booked })).ok).toBe(true)
  })

  it("doesn't allow overlapping bookings", () => {
    const clash = makeSession(5, 18, { id: 'ses_other', startsAt: new Date(2026, 10, 5, 18, 30).toISOString() })
    expect(canBook(unlimited, thursday, context({ memberBookedSessions: [clash] }))).toEqual({
      ok: false,
      message: 'You already have a booking at this time.',
    })
  })

  it('allows a class that starts right as another ends', () => {
    const before = makeSession(5, 17, { startsAt: new Date(2026, 10, 5, 17, 15).toISOString() })
    expect(canBook(unlimited, thursday, context({ memberBookedSessions: [before] })).ok).toBe(true)
  })
})

describe('canCancel', () => {
  const booking = { id: 'b_1', status: 'BOOKED' }

  it('allows cancelling 3 hours before', () => {
    const session = makeSession(4, 13)
    expect(canCancel(booking, session, now)).toEqual({ ok: true })
  })

  it("doesn't allow cancelling 1 hour before", () => {
    const session = makeSession(4, 11)
    expect(canCancel(booking, session, now)).toEqual({
      ok: false,
      message: "You can't cancel within 2 hours of the class starting.",
    })
  })

  it("doesn't allow cancelling a booking twice", () => {
    const session = makeSession(5, 18)
    expect(canCancel({ ...booking, status: 'CANCELLED' }, session, now)).toEqual({
      ok: false,
      message: 'This booking is already cancelled.',
    })
  })
})
