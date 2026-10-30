'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, Dumbbell, LayoutList, LogOut, Ticket } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { logOut } from '@/lib/requests/auth'
import Avatar from '@/components/ui/Avatar'

const MEMBER_LINKS = [
  { href: '/', label: 'Timetable', icon: CalendarDays },
  { href: '/my-bookings', label: 'My bookings', icon: Ticket },
]

const STAFF_LINKS = [{ href: '/staff', label: 'Classes', icon: LayoutList }]

function isActive(pathname, href) {
  return href === '/' ? pathname === '/' || pathname.startsWith('/classes') : pathname.startsWith(href)
}

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useCurrentUser()

  if (pathname === '/login') return null

  const links = user?.role === 'STAFF' ? STAFF_LINKS : user ? MEMBER_LINKS : []

  async function handleLogOut() {
    await logOut()
    router.push('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link href={user?.role === 'STAFF' ? '/staff' : '/'} className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Dumbbell size={18} aria-hidden="true" />
              </span>
              GetFit
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(pathname, href) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-ink'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="sm" />
              <span className="hidden text-sm font-medium text-ink md:inline">{user.name}</span>
              <button
                type="button"
                onClick={handleLogOut}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-ink md:inline-flex"
              >
                Log out
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Phones get a bottom tab bar instead of the top links */}
      {user && (
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
          <div className="flex justify-around">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  isActive(pathname, href) ? 'text-brand-600' : 'text-slate-500'
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogOut}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-slate-500"
            >
              <LogOut size={20} aria-hidden="true" />
              Log out
            </button>
          </div>
        </nav>
      )}
    </>
  )
}
