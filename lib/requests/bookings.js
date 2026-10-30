import { request } from './client.js'

export function getMyBookings() {
  return request('/api/bookings')
}

export async function bookClass(sessionId) {
  const data = await request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  })
  return data.booking
}

export async function cancelBooking(bookingId) {
  const data = await request(`/api/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'CANCELLED' }),
  })
  return data.booking
}
