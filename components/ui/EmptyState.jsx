import { CalendarX2 } from 'lucide-react'

export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <CalendarX2 size={20} aria-hidden="true" />
      </span>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}
