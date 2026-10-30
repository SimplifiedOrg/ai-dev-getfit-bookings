import { readDb } from '../db.js'

function toMemberUser(member) {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    role: 'MEMBER',
    membershipTier: member.membershipTier,
  }
}

function toStaffUser(person) {
  return { id: person.id, name: person.name, email: person.email, role: 'STAFF' }
}

export function findPersonByEmail(email) {
  const wanted = String(email ?? '').trim().toLowerCase()
  if (!wanted) return null

  const db = readDb()
  const member = db.members.find((m) => m.email.toLowerCase() === wanted)
  if (member) return toMemberUser(member)

  const staff = db.staff.find((s) => s.email.toLowerCase() === wanted)
  return staff ? toStaffUser(staff) : null
}

export function findPersonById(id) {
  const db = readDb()
  const member = db.members.find((m) => m.id === id)
  if (member) return toMemberUser(member)

  const staff = db.staff.find((s) => s.id === id)
  return staff ? toStaffUser(staff) : null
}

export function getMember(id) {
  return readDb().members.find((m) => m.id === id) ?? null
}
