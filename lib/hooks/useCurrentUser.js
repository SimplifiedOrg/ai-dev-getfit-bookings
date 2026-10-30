'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getCurrentUser } from '../requests/auth.js'

const homeFor = (user) => (user.role === 'STAFF' ? '/staff' : '/')

// Pass a role to send everyone else away: logged out -> /login, wrong role -> their home page
export function useCurrentUser(requiredRole) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState({ user: null, loading: true, error: null })

  useEffect(() => {
    let ignore = false

    getCurrentUser()
      .then((user) => {
        if (ignore) return
        setState({ user, loading: false, error: null })

        if (!requiredRole) return
        if (!user) router.replace('/login')
        else if (user.role !== requiredRole) router.replace(homeFor(user))
      })
      .catch((err) => {
        if (!ignore) setState({ user: null, loading: false, error: err.message })
      })

    return () => {
      ignore = true
    }
  }, [requiredRole, router, pathname])

  const allowed = !requiredRole || state.user?.role === requiredRole
  return { ...state, user: allowed ? state.user : null }
}
