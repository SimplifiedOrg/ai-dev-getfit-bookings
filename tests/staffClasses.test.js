import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeTestDb } from './helpers/makeTestDb.js'
import { PATCH } from '@/app/api/staff/classes/[id]/route'

const NOW = new Date(2026, 10, 4, 10, 0)

// Sends the body the same way the edit form does
function editRequest(body, cookie) {
  return new Request('http://localhost/api/staff/classes/x', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(cookie && { cookie }) },
    body: JSON.stringify(body),
  })
}

describe('PATCH /api/staff/classes/[id]', () => {
  let db
  let session

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    db = makeTestDb()
    session = db.read().sessions.find((s) => s.classTypeId === 'ct_spin')
  })

  afterEach(() => {
    db.cleanup()
    vi.useRealTimers()
  })

  const edit = (body, cookie = 'getfit_user=s_morgan') =>
    PATCH(editRequest(body, cookie), { params: Promise.resolve({ id: session.id }) })

  it('saves a new studio', async () => {
    const response = await edit({ studio: 'Studio 3' })

    expect(response.status).toBe(200)
    expect(db.read().sessions.find((s) => s.id === session.id).studio).toBe('Studio 3')
  })

  it('saves a new capacity', async () => {
    await edit({ capacity: '10' })

    expect(db.read().sessions.find((s) => s.id === session.id).capacity).toBe(10)
  })

  it('returns 404 for a class that does not exist', async () => {
    const response = await PATCH(editRequest({ studio: 'Studio 1' }, 'getfit_user=s_morgan'), {
      params: Promise.resolve({ id: 'nope' }),
    })

    expect(response.status).toBe(404)
  })

  it.skip('returns 403 when a member edits a class', async () => {
    const response = await edit({ capacity: '20' }, 'getfit_user=m_alex')

    expect(response.status).toBe(403)
  })
})
