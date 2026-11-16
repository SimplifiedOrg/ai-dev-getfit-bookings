import { readDb, writeDb } from '../db.js'
import { AppError } from '../errors.js'

const STUDIOS = ['Studio 1', 'Studio 2', 'Studio 3']

export function listInstructors() {
  return readDb().instructors.map(({ id, name }) => ({ id, name }))
}

export function updateSession(id, updates) {
  const db = readDb()
  const session = db.sessions.find((s) => s.id === id)
  if (!session) throw new AppError(404, 'Class not found.')

  if (updates.startsAt) session.startsAt = new Date(updates.startsAt).toISOString()

  if (updates.studio) {
    if (!STUDIOS.includes(updates.studio)) throw new AppError(400, 'Please choose a studio.')
    session.studio = updates.studio
  }

  if (updates.capacity) session.capacity = updates.capacity

  // Only look up the instructor if it's changed
  if (updates.instructorId && updates.instructorId !== session.instructorId) {
    const instructor = db.instructors.find((i) => i.id === updates.instructorId)
    if (!instructor) throw new AppError(400, 'Please choose an instructor.')
    session.instructorId = instructor.name
  }

  writeDb(db)
  return session
}
