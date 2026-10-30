import { AppError, toErrorResponse } from '@/server/errors'
import { getCurrentUser, USER_COOKIE } from '@/server/currentUser'
import { findPersonByEmail } from '@/server/services/members'

export async function POST(request) {
  try {
    const { email } = await request.json()
    const user = findPersonByEmail(email)
    if (!user) {
      throw new AppError(404, "We couldn't find an account with that email.")
    }

    const response = Response.json({ user })
    response.headers.set('Set-Cookie', `${USER_COOKIE}=${user.id}; Path=/; HttpOnly; SameSite=Lax`)
    return response
  } catch (err) {
    return toErrorResponse(err)
  }
}

export async function GET(request) {
  try {
    const user = getCurrentUser(request)
    return Response.json({ user })
  } catch (err) {
    return toErrorResponse(err)
  }
}

export async function DELETE() {
  return new Response(null, {
    status: 204,
    headers: { 'Set-Cookie': `${USER_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` },
  })
}
