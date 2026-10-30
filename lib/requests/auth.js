import { request } from './client.js'

export async function logIn(email) {
  const data = await request('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return data.user
}

export async function logOut() {
  await request('/api/auth', { method: 'DELETE' })
}

export async function getCurrentUser() {
  const data = await request('/api/auth')
  return data.user
}
