import ClassCard from './ClassCard'

const PARTS_OF_DAY = [
  { label: 'Morning', matches: (hour) => hour < 12 },
  { label: 'Afternoon', matches: (hour) => hour >= 12 && hour < 17 },
  { label: 'Evening', matches: (hour) => hour >= 17 },
]

export default function DayColumn({ date, sessions }) {
  const day = new Date(date)
  const isToday = day.toDateString() === new Date().toDateString()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
        <div>
          <p className="text-sm font-semibold text-ink">{day.toLocaleDateString('en-AU', { weekday: 'long' })}</p>
          <p className="text-xs text-slate-500">{day.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
        </div>
        {isToday && (
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">Today</span>
        )}
      </div>

      {sessions.length === 0 && <p className="py-4 text-center text-xs text-slate-400">No classes</p>}

      {PARTS_OF_DAY.map(({ label, matches }) => {
        const inPart = sessions.filter((s) => matches(new Date(s.startsAt).getHours()))
        if (inPart.length === 0) return null

        return (
          <div key={label} className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
            {inPart.map((session) => (
              <ClassCard key={session.id} session={session} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
