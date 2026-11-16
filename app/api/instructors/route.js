import { toErrorResponse } from '@/server/errors'
import { requireStaff } from '@/server/currentUser'
import { listInstructors } from '@/server/services/staffClasses'

export async function GET(request) {
  try {
    requireStaff(request)
    return Response.json({ instructors: listInstructors() })
  } catch (err) {
    return toErrorResponse(err)
  }
}
