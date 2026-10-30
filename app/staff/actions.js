'use server'

import { cookies } from 'next/headers'
import { readDb, writeDb } from '@/server/db'

const STUDIOS = ['Studio 1', 'Studio 2', 'Studio 3']

export async function updateClass(prevState, formData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('getfit_user')?.value

  const db = readDb()
  if (!db.staff.some((s) => s.id === userId)) {
    return { error: 'Staff only.' }
  }

  const session = db.sessions.find((s) => s.id === formData.get('id'))
  if (!session) {
    return { error: 'Class not found.' }
  }

  const startsAt = new Date(formData.get('startsAt'))
  const studio = formData.get('studio')
  const capacity = Number(formData.get('capacity'))

  if (isNaN(startsAt.getTime())) return { error: 'Please enter a valid start time.' }
  if (!STUDIOS.includes(studio)) return { error: 'Please choose a studio.' }
  if (!Number.isInteger(capacity) || capacity < 1) {
    return { error: 'Capacity must be a whole number of 1 or more.' }
  }

  session.startsAt = startsAt.toISOString()
  session.studio = studio
  session.capacity = capacity
  writeDb(db)

  return { message: 'Saved' }
}
