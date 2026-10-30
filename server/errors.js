export class AppError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'AppError'
    this.status = status
  }
}

export function toErrorResponse(err) {
  if (err instanceof AppError) {
    return Response.json({ error: err.message }, { status: err.status })
  }
  console.error(err)
  return Response.json({ error: 'Something went wrong.' }, { status: 500 })
}
