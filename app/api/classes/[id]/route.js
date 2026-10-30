import { toErrorResponse } from '@/server/errors'
import { requireUser } from '@/server/currentUser'
import { getSession } from '@/server/services/classes'

export async function GET(request, { params }) {
  try {
    const user = requireUser(request)
    const { id } = await params
    const memberId = user.role === 'MEMBER' ? user.id : null

    return Response.json({ session: getSession(id, memberId) })
  } catch (err) {
    return toErrorResponse(err)
  }
}
