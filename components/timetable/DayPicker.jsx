export default function DayPicker({ days, selected, onSelect }) {
  const today = new Date().toDateString()

  return (
    <div className="grid grid-cols-7 gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
      {days.map((day, i) => {
        const active = i === selected
        const isToday = day.toDateString() === today

        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={active}
            aria-label={day.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
            className={`flex flex-col items-center rounded-lg py-2 text-xs ${
              active ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>{day.toLocaleDateString('en-AU', { weekday: 'narrow' })}</span>
            <span className={`mt-0.5 text-sm font-semibold ${active ? 'text-white' : 'text-ink'}`}>{day.getDate()}</span>
            <span className={`mt-1 h-1 w-1 rounded-full ${isToday && !active ? 'bg-brand-600' : 'bg-transparent'}`} />
          </button>
        )
      })}
    </div>
  )
}
