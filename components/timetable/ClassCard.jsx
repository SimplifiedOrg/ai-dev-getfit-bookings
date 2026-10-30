import Link from 'next/link'
import { formatTimeRange } from '@/lib/dates'
import { coloursFor } from '@/lib/classColours'
import CapacityBar from '@/components/ui/CapacityBar'

function Availability({ session }) {
  if (session.hasStarted) {
    return <span className="text-slate-400">Started</span>
  }
  if (session.spotsLeft === 0) {
    return <span className="font-semibold text-red-600">Full</span>
  }
  const colour = session.spotsLeft <= 2 ? 'font-medium text-amber-700' : 'text-slate-500'
  return <span className={colour}>{`${session.spotsLeft} spots left`}</span>
}

export default function ClassCard({ session }) {
  const colours = coloursFor(session.classType)

  return (
    <Link
      href={`/classes/${session.id}`}
      className={`block rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md ${
        session.hasStarted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${colours.dot}`} />
          <p className="truncate text-sm font-semibold text-ink">{session.classType.name}</p>
        </div>
        {session.myBookingId && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">Booked</span>
        )}
      </div>

      <p className="mt-1 text-sm text-slate-600">{formatTimeRange(session.startsAt, session.endsAt)}</p>
      <p className="text-xs text-slate-500">
        <span>{session.instructor.name}</span>
        <span aria-hidden="true"> · </span>
        <span>{session.studio}</span>
      </p>

      <CapacityBar booked={session.bookedCount} capacity={session.capacity} className="mt-3" />
      <p className="mt-1.5 text-xs">
        <Availability session={session} />
      </p>
    </Link>
  )
}
