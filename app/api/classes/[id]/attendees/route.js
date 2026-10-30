import { toErrorResponse } from '@/server/errors'
import { requireStaff } from '@/server/currentUser'
import { getAttendees } from '@/server/services/bookings'

export async function GET(request, { params }) {
  try {
    requireStaff(request)
    const { id } = await params
    return Response.json({ attendees: getAttendees(id) })
  } catch (err) {
    return toErrorResponse(err)
  }
}
