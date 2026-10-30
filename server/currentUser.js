import { AppError } from './errors.js'
import { findPersonById } from './services/members.js'

export const USER_COOKIE = 'getfit_user'

// Reads the cookie header directly so route handlers can be tested with a plain Request
function readCookie(request, name) {
  const header = request.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function getCurrentUser(request) {
  const id = readCookie(request, USER_COOKIE)
  if (!id) return null
  return findPersonById(id)
}

export function requireUser(request) {
  const user = getCurrentUser(request)
  if (!user) throw new AppError(401, 'Please log in.')
  return user
}

export function requireMember(request) {
  const user = requireUser(request)
  if (user.role !== 'MEMBER') throw new AppError(403, 'Members only.')
  return user
}

export function requireStaff(request) {
  const user = requireUser(request)
  if (user.role !== 'STAFF') throw new AppError(403, 'Staff only.')
  return user
}
