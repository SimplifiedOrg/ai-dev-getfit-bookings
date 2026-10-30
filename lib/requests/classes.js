import { request } from './client.js'

export function getClasses(week = 'this') {
  return request(`/api/classes?week=${week}`)
}

export async function getClass(id) {
  const data = await request(`/api/classes/${id}`)
  return data.session
}

export async function getAttendees(id) {
  const data = await request(`/api/classes/${id}/attendees`)
  return data.attendees
}
