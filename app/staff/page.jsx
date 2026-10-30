'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CapacityBar from '@/components/ui/CapacityBar'
import Skeleton from '@/components/ui/Skeleton'
import StatCard from '@/components/ui/StatCard'
import WeekTabs from '@/components/ui/WeekTabs'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { getClasses } from '@/lib/requests/classes'
import { coloursFor } from '@/lib/classColours'
import { formatDay, formatTimeRange } from '@/lib/dates'

function getStats(sessions) {
  const bookings = sessions.reduce((total, s) => total + s.bookedCount, 0)
  const fill = sessions.reduce((total, s) => total + s.bookedCount / s.capacity, 0) / (sessions.length || 1)

  return [
    { label: 'Classes', value: sessions.length },
    { label: 'Bookings', value: bookings },
    { label: 'Average fill', value: `${Math.round(fill * 100)}%` },
    { label: 'Full classes', value: sessions.filter((s) => s.spotsLeft === 0).length },
  ]
}

export default function StaffClassesPage() {
  const { user, error: userError } = useCurrentUser('STAFF')
  const [week, setWeek] = useState('this')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    getClasses(week)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [user, week])

  function changeWeek(value) {
    setData(null)
    setWeek(value)
  }

  if (userError || error) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{userError || error}</p>
  }

  // Newest first for staff, unlike the member timetable
  const sessions = data ? [...data.sessions].sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt)) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Classes</h1>
          <p className="mt-1 text-slate-600">Edit classes and see who's booked in.</p>
        </div>
        <WeekTabs value={week} onChange={changeWeek} />
      </div>

      {!user || !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {getStats(data.sessions).map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Studio</th>
                  <th className="px-4 py-3">Booked</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((session) => (
                  <tr key={session.id} className={session.hasStarted ? 'text-slate-400' : 'text-ink'}>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDay(session.startsAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatTimeRange(session.startsAt, session.endsAt)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <span className={`h-2 w-2 rounded-full ${coloursFor(session.classType).dot}`} />
                        {session.classType.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">{session.instructor.name}</td>
                    <td className="px-4 py-3">{session.studio}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CapacityBar booked={session.bookedCount} capacity={session.capacity} className="w-20" />
                        <span className="tabular-nums">
                          {session.bookedCount}/{session.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/staff/classes/${session.id}`} className="font-medium text-brand-700 hover:text-brand-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Same rows as cards on phones */}
          <ul className="space-y-3 md:hidden">
            {sessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/staff/classes/${session.id}`}
                  className={`block rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${session.hasStarted ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-semibold text-ink">
                      <span className={`h-2 w-2 rounded-full ${coloursFor(session.classType).dot}`} />
                      {session.classType.name}
                    </span>
                    <span className="text-sm font-medium text-brand-700">Edit</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDay(session.startsAt)} · {formatTimeRange(session.startsAt, session.endsAt)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {session.instructor.name} · {session.studio}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <CapacityBar booked={session.bookedCount} capacity={session.capacity} className="flex-1" />
                    <span className="text-sm tabular-nums text-slate-600">
                      {session.bookedCount}/{session.capacity}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
