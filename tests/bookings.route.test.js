import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeTestDb } from './helpers/makeTestDb.js'
import { POST } from '@/app/api/bookings/route'

const NOW = new Date(2026, 10, 4, 10, 0)

function bookingRequest(sessionId, cookie) {
  return new Request('http://localhost/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie && { cookie }) },
    body: JSON.stringify({ sessionId }),
  })
}

describe('POST /api/bookings', () => {
  let db
  let sessions

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    db = makeTestDb()
    sessions = db.read().sessions
  })

  afterEach(() => {
    db.cleanup()
    vi.useRealTimers()
  })

  const sessionAt = (classTypeId, day, hours) =>
    sessions.find(
      (s) => s.classTypeId === classTypeId && new Date(s.startsAt).getTime() === new Date(2026, 10, day, hours).getTime()
    )

  it('returns 201 for a valid booking', async () => {
    const response = await POST(bookingRequest(sessionAt('ct_hiit', 5, 18).id, 'getfit_user=m_alex'))
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.booking.memberId).toBe('m_alex')
  })

  it('returns 409 for a full class', async () => {
    const response = await POST(bookingRequest(sessionAt('ct_spin', 7, 9).id, 'getfit_user=m_alex'))

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: 'This class is full.' })
  })

  it('returns 401 when no one is logged in', async () => {
    const response = await POST(bookingRequest(sessionAt('ct_hiit', 5, 18).id))

    expect(response.status).toBe(401)
  })
})
