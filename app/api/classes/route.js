import { toErrorResponse } from '@/server/errors'
import { requireUser } from '@/server/currentUser'
import { listSessions } from '@/server/services/classes'

export async function GET(request) {
  try {
    const user = requireUser(request)
    const week = new URL(request.url).searchParams.get('week') ?? 'this'
    const memberId = user.role === 'MEMBER' ? user.id : null

    return Response.json(listSessions({ week, memberId }))
  } catch (err) {
    return toErrorResponse(err)
  }
}
