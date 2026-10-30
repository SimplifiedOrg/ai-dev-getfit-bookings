'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import AddToCalendarButton from '@/components/bookings/AddToCalendarButton'
import Avatar from '@/components/ui/Avatar'
import BookButton from '@/components/bookings/BookButton'
import CancelButton from '@/components/bookings/CancelButton'
import CapacityBar from '@/components/ui/CapacityBar'
import DateTile from '@/components/ui/DateTile'
import Skeleton from '@/components/ui/Skeleton'
import StatusBadge from '@/components/ui/StatusBadge'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { getClass } from '@/lib/requests/classes'
import { coloursFor } from '@/lib/classColours'
import { formatDay, formatTime, formatTimeRange } from '@/lib/dates'

function Detail({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-700">
      <Icon size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
      {children}
    </div>
  )
}

export default function ClassPage() {
  const { id } = useParams()
  const { user, error: userError } = useCurrentUser('MEMBER')
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  const loadSession = useCallback(() => {
    getClass(id)
      .then(setSession)
      .catch((err) => setError(err.message))
  }, [id])

  useEffect(() => {
    if (user) loadSession()
  }, [user, loadSession])

  if (userError || error) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{userError || error}</p>
  }

  if (!user || !session) {
    return (
      <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
        <Skeleton className="h-80" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  const colours = coloursFor(session.classType)

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to timetable
      </Link>

      <div className="grid items-start gap-6 md:grid-cols-[3fr_2fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${colours.soft} ${colours.text}`}>
            {session.classType.name}
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
            {new Date(session.startsAt).toLocaleDateString('en-AU', { weekday: 'long' })} {session.classType.name}
          </h1>
          <p className="mt-2 leading-relaxed text-slate-600">{session.classType.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Detail icon={CalendarDays}>{formatDay(session.startsAt)}</Detail>
            <Detail icon={Clock}>
              {formatTimeRange(session.startsAt, session.endsAt)} · {session.durationMins} mins
            </Detail>
            <Detail icon={MapPin}>{session.studio}</Detail>
            <Detail icon={Users}>
              {session.bookedCount} of {session.capacity} booked
            </Detail>
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-6">
            <Avatar name={session.instructor.name} size="lg" />
            <div>
              <p className="font-semibold text-ink">{session.instructor.name}</p>
              <p className="text-sm text-slate-600">{session.instructor.bio}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:sticky md:top-24">
          <div className="flex items-center gap-4">
            <DateTile date={session.startsAt} colour={session.classType.colour} />
            <div>
              <p className="text-lg font-semibold text-ink">{formatTime(session.startsAt)}</p>
              <p className="text-sm text-slate-500">{session.durationMins} mins with {session.instructor.name}</p>
            </div>
          </div>

          <CapacityBar booked={session.bookedCount} capacity={session.capacity} className="mt-6 h-2" />
          <p className="mt-2 text-sm text-slate-600">
            {session.spotsLeft === 0 ? 'Full' : `${session.spotsLeft} of ${session.capacity} spots left`}
          </p>

          <div className="mt-6">
            {session.myBookingId ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status="BOOKED" />
                  <AddToCalendarButton session={session} />
                </div>
                <CancelButton bookingId={session.myBookingId} onCancelled={loadSession} />
              </div>
            ) : (
              <BookButton session={session} onBooked={loadSession} />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
