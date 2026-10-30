export default function CapacityBar({ booked, capacity, className = '' }) {
  const spotsLeft = capacity - booked
  const percent = Math.min(100, Math.round((booked / capacity) * 100))

  let colour = 'bg-brand-500'
  if (spotsLeft <= 0) colour = 'bg-red-500'
  else if (spotsLeft <= 2) colour = 'bg-amber-500'

  // The spots text next to the bar is what screen readers get
  return (
    <div aria-hidden="true" className={`h-1.5 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className={`h-full rounded-full ${colour}`} style={{ width: `${percent}%` }} />
    </div>
  )
}
