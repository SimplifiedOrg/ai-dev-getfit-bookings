'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Search } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Skeleton from '@/components/ui/Skeleton'
import { updateClass } from '@/app/staff/actions'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { getAttendees, getClass } from '@/lib/requests/classes'
import { formatDay, formatTimeRange } from '@/lib/dates'

// datetime-local inputs want "YYYY-MM-DDTHH:mm" in local time
function toInputValue(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none'

export default function EditClassPage() {
  const { id } = useParams()
  const { user, error: userError } = useCurrentUser('STAFF')
  const [session, setSession] = useState(null)
  const [attendees, setAttendees] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [state, formAction, pending] = useActionState(updateClass, {})

  useEffect(() => {
    if (!user) return
    getClass(id)
      .then(setSession)
      .catch((err) => setError(err.message))
    getAttendees(id)
      .then(setAttendees)
      .catch((err) => setError(err.message))
  }, [user, id])

  if (userError || error) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{userError || error}</p>
  }

  if (!user || !session || !attendees) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  const query = search.trim().toLowerCase()
  const shown = attendees.filter(
    (a) => a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query)
  )

  return (
    <div className="space-y-6">
      <div>
        <Link href="/staff" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to classes
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink md:text-3xl">{session.classType.name}</h1>
        <p className="mt-1 text-slate-600">
          {formatDay(session.startsAt)}, {formatTimeRange(session.startsAt, session.endsAt)} with {session.instructor.name}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">Edit class</h2>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="id" value={session.id} />

            <div>
              <label htmlFor="startsAt" className="mb-1 block text-sm font-medium text-slate-700">
                Start date and time
              </label>
              <input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                defaultValue={toInputValue(session.startsAt)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="studio" className="mb-1 block text-sm font-medium text-slate-700">
                  Studio
                </label>
                <select id="studio" name="studio" defaultValue={session.studio} className={inputClass}>
                  <option>Studio 1</option>
                  <option>Studio 2</option>
                  <option>Studio 3</option>
                </select>
              </div>

              <div>
                <label htmlFor="capacity" className="mb-1 block text-sm font-medium text-slate-700">
                  Capacity
                </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue={session.capacity}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
              >
                Save changes
              </button>
              {state.message && <span className="text-sm font-medium text-green-700">{state.message}</span>}
              {state.error && <span className="text-sm text-red-600">{state.error}</span>}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Attendees</h2>
            <span className="text-sm text-slate-500">
              {attendees.length} of {session.capacity}
            </span>
          </div>

          {attendees.length === 0 ? (
            <p className="text-sm text-slate-500">No one has booked this class yet.</p>
          ) : (
            <>
              <div className="relative mb-3">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  aria-label="Search attendees"
                  className={`${inputClass} pl-9`}
                />
              </div>

              <ul className="divide-y divide-slate-100">
                {shown.map((a) => (
                  <li key={a.bookingId} className="flex items-center gap-3 py-3">
                    <Avatar name={a.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{a.name}</p>
                      <p className="truncate text-sm text-slate-500">{a.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {a.membershipTier === 'CASUAL' ? 'Casual' : 'Unlimited'}
                    </span>
                  </li>
                ))}
              </ul>
              {shown.length === 0 && <p className="py-3 text-sm text-slate-500">No one matches "{search}".</p>}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
