import Link from 'next/link'
import { formatTimeRange } from '@/lib/dates'
import AddToCalendarButton from './AddToCalendarButton'
import CancelButton from './CancelButton'
import DateTile from '@/components/ui/DateTile'
import StatusBadge from '@/components/ui/StatusBadge'

export default function BookingList({ bookings, onCancelled }) {
  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {bookings.map((booking) => {
        const { session } = booking
        const canCancel = booking.status === 'BOOKED' && !session.hasStarted

        return (
          <li key={booking.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-1 items-center gap-4">
              <DateTile date={session.startsAt} colour={session.classType.colour} />
              <div className="min-w-0">
                <Link href={`/classes/${session.id}`} className="font-semibold text-ink hover:text-brand-600">
                  {session.classType.name}
                </Link>
                <p className="text-sm text-slate-600">
                  {formatTimeRange(session.startsAt, session.endsAt)} · {session.studio}
                </p>
                <p className="text-sm text-slate-500">with {session.instructor.name}</p>
              </div>
            </div>

            {canCancel ? (
              <div className="flex gap-2 sm:shrink-0">
                <AddToCalendarButton session={session} className="flex-1 sm:flex-none" />
                <CancelButton bookingId={booking.id} onCancelled={onCancelled} className="flex-1 sm:flex-none" />
              </div>
            ) : (
              <div className="pl-[4.5rem] sm:pl-0">
                <StatusBadge status={booking.status} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
