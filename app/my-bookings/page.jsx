'use client'

import { useCallback, useEffect, useState } from 'react'
import BookingList from '@/components/bookings/BookingList'
import EmptyState from '@/components/ui/EmptyState'
import MembershipSummary from '@/components/bookings/MembershipSummary'
import Skeleton from '@/components/ui/Skeleton'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { getMyBookings } from '@/lib/requests/bookings'

export default function MyBookingsPage() {
  const { user, error: userError } = useCurrentUser('MEMBER')
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState(null)

  const loadBookings = useCallback(() => {
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (user) loadBookings()
  }, [user, loadBookings])

  if (userError || error) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{userError || error}</p>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">My bookings</h1>

      {!user || !bookings ? (
        <div className="space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <>
          <MembershipSummary weeklyUsage={bookings.weeklyUsage} />

          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">Upcoming</h2>
            {bookings.upcoming.length > 0 ? (
              <BookingList bookings={bookings.upcoming} onCancelled={loadBookings} />
            ) : (
              <EmptyState message="No orders yet" />
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-ink">Past</h2>
            {bookings.past.length > 0 ? (
              <BookingList bookings={bookings.past} />
            ) : (
              <EmptyState message="No orders yet" />
            )}
          </section>
        </>
      )}
    </div>
  )
}
