'use client'

import { useEffect, useState } from 'react'
import ClassTypeFilter from '@/components/timetable/ClassTypeFilter'
import Skeleton from '@/components/ui/Skeleton'
import Timetable from '@/components/timetable/Timetable'
import WeekTabs from '@/components/ui/WeekTabs'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { getClasses } from '@/lib/requests/classes'
import { addDays, formatWeekRange, startOfWeek } from '@/lib/dates'

export default function TimetablePage() {
  const { user, error: userError } = useCurrentUser('MEMBER')
  const [week, setWeek] = useState('this')
  const [filter, setFilter] = useState('All')
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

  const weekStart = addDays(startOfWeek(new Date()), week === 'next' ? 7 : 0)
  const sessions = !data ? [] : filter === 'All' ? data.sessions : data.sessions.filter((s) => s.classType.name === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Timetable</h1>
          <p className="mt-1 text-slate-600">
            {week === 'this' ? 'This week' : 'Next week'} · {formatWeekRange(weekStart)}
          </p>
        </div>
        <WeekTabs value={week} onChange={changeWeek} />
      </div>

      <ClassTypeFilter value={filter} onChange={setFilter} />

      {!user || !data ? (
        <div className="grid gap-3 lg:grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className={`h-40 ${i > 0 ? 'hidden lg:block' : ''}`} />
          ))}
        </div>
      ) : (
        <Timetable key={data.weekStart} weekStart={data.weekStart} sessions={sessions} />
      )}
    </div>
  )
}
