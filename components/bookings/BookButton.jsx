'use client'

import { useState } from 'react'
import { bookClass } from '@/lib/requests/bookings'

export default function BookButton({ session, onBooked }) {
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  let label = 'Book'
  if (session.hasStarted) label = 'Started'
  else if (session.spotsLeft === 0) label = 'Class full'

  const disabled = label !== 'Book' || saving

  async function handleClick() {
    setError(null)
    setSaving(true)
    try {
      await bookClass(session.id)
      onBooked?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
      >
        {saving ? 'Booking…' : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
