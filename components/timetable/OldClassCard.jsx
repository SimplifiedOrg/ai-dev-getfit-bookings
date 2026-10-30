import Link from 'next/link'
import { formatTimeRange } from '@/lib/dates'
import { coloursFor } from '@/lib/classColours'

export default function OldClassCard({ session }) {
  const colours = coloursFor(session.classType)
  const full = session.spotsLeft === 0

  return (
    <Link
      href={`/classes/${session.id}`}
      className={`block rounded-xl border-l-4 bg-white p-3 shadow-sm hover:shadow-md ${colours.border} ${
        session.hasStarted ? 'opacity-60' : ''
      }`}
    >
      <p className="text-sm font-semibold text-ink">{session.classType.name}</p>
      <p className="mt-1 text-sm text-slate-600">{formatTimeRange(session.startsAt, session.endsAt)}</p>
      <p className="text-xs text-slate-500">
        {session.instructor.name}, {session.studio}
      </p>
      <p className={`mt-2 text-xs ${full ? 'font-semibold text-red-600' : 'text-slate-500'}`}>
        {full ? 'Full' : `${session.spotsLeft} left`}
      </p>
    </Link>
  )
}
