import { classColours } from '@/lib/classColours'

export default function DateTile({ date, colour }) {
  const d = new Date(date)
  const colours = classColours[colour] ?? classColours.blue

  return (
    <div className="w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-center">
      <p className={`py-0.5 text-[11px] font-semibold uppercase tracking-wide ${colours.soft} ${colours.text}`}>
        {d.toLocaleDateString('en-AU', { weekday: 'short' })}
      </p>
      <p className="pt-1 text-xl leading-none font-semibold text-ink">{d.getDate()}</p>
      <p className="pb-1 text-[11px] text-slate-500">{d.toLocaleDateString('en-AU', { month: 'short' })}</p>
    </div>
  )
}
