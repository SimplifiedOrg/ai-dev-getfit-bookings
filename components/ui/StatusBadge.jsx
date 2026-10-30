const styles = {
  BOOKED: 'bg-green-50 text-green-700 ring-green-600/20',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

const labels = {
  BOOKED: 'Booked',
  CANCELLED: 'Cancelled',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
