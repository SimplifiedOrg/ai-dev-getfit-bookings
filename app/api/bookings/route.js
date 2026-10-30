import { toErrorResponse } from '@/server/errors'
import { requireMember } from '@/server/currentUser'
import { createBooking, getBookingsForMember } from '@/server/services/bookings'

export async function GET(request) {
  try {
    const user = requireMember(request)
    return Response.json(getBookingsForMember(user.id))
  } catch (err) {
    return toErrorResponse(err)
  }
}

export async function POST(request) {
  try {
    const user = requireMember(request)
    const { sessionId } = await request.json()
    const booking = createBooking(user.id, sessionId)
    return Response.json({ booking }, { status: 201 })
  } catch (err) {
    return toErrorResponse(err)
  }
}
