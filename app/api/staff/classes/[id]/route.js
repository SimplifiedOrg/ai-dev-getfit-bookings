import { toErrorResponse } from '@/server/errors'
import { requireUser } from '@/server/currentUser'
import { updateSession } from '@/server/services/staffClasses'

export async function PATCH(request, { params }) {
  try {
    requireUser(request)
    const { id } = await params
    const updates = await request.json()

    return Response.json({ session: updateSession(id, updates) })
  } catch (err) {
    return toErrorResponse(err)
  }
}
