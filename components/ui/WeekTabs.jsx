import { addDays, formatWeekRange, startOfWeek } from '@/lib/dates'

export default function WeekTabs({ value, onChange }) {
  const thisWeek = startOfWeek(new Date())
  const tabs = [
    { value: 'this', label: 'This week', dates: formatWeekRange(thisWeek) },
    { value: 'next', label: 'Next week', dates: formatWeekRange(addDays(thisWeek, 7)) },
  ]

  return (
    <div className="inline-flex w-full rounded-xl bg-slate-200/60 p-1 sm:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          aria-pressed={value === tab.value}
          className={`flex-1 rounded-lg px-4 py-2 text-sm whitespace-nowrap sm:flex-none ${
            value === tab.value ? 'bg-white font-semibold text-ink shadow-sm' : 'text-slate-600 hover:text-ink'
          }`}
        >
          {tab.label}
          <span className="ml-1.5 hidden text-slate-400 sm:inline">{tab.dates}</span>
        </button>
      ))}
    </div>
  )
}
