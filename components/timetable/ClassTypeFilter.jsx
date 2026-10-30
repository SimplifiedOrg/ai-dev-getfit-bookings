import { classColours } from '@/lib/classColours'

const OPTIONS = [
  { name: 'All' },
  { name: 'Yoga', colour: 'green' },
  { name: 'HIIT', colour: 'orange' },
  { name: 'Spin', colour: 'blue' },
  { name: 'Pilates', colour: 'purple' },
]

export default function ClassTypeFilter({ value, onChange }) {
  return (
    // Scrolls sideways on small screens rather than wrapping
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
      {OPTIONS.map(({ name, colour }) => {
        const active = value === name

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            aria-pressed={active}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {colour && <span className={`h-2 w-2 rounded-full ${classColours[colour].dot}`} />}
            {name}
          </button>
        )
      })}
    </div>
  )
}
