import { AppError, toErrorResponse } from '@/server/errors'
import { requireMember } from '@/server/currentUser'
import { cancelBooking } from '@/server/services/bookings'

// Only cancelling is supported for now
export async function PATCH(request, { params }) {
  try {
    const user = requireMember(request)
    const { id } = await params
    const { status } = await request.json()
    if (status !== 'CANCELLED') {
      throw new AppError(400, 'Only cancelling a booking is supported.')
    }

    const booking = cancelBooking(user.id, id)
    return Response.json({ booking })
  } catch (err) {
    return toErrorResponse(err)
  }
}
