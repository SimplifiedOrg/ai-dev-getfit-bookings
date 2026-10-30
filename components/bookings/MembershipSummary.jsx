function UsageRow({ label, used, limit }) {
  const percent = Math.min(100, Math.round((used / limit) * 100))

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-brand-800">{label}</span>
        <span className="font-medium text-brand-800">
          {used} of {limit}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-100">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function MembershipSummary({ weeklyUsage }) {
  const { membershipTier, limit, thisWeek, nextWeek } = weeklyUsage

  if (membershipTier !== 'CASUAL') {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
        <p className="font-semibold text-brand-800">Unlimited membership</p>
        <p className="mt-0.5 text-sm text-brand-700">
          No weekly limit · {thisWeek} {thisWeek === 1 ? 'class' : 'classes'} booked this week
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
      <p className="font-semibold text-brand-800">Casual membership</p>
      <p className="mt-0.5 text-sm text-brand-700">You can book {limit} classes each week.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-6">
        <UsageRow label="This week" used={thisWeek} limit={limit} />
        <UsageRow label="Next week" used={nextWeek} limit={limit} />
      </div>
    </div>
  )
}
