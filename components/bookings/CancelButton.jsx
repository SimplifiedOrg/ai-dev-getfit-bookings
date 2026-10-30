'use client'

import { useState } from 'react'
import { cancelBooking } from '@/lib/requests/bookings'

export default function CancelButton({ bookingId, onCancelled, className = '' }) {
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleClick() {
    setError(null)
    setSaving(true)
    try {
      await cancelBooking(bookingId)
      onCancelled?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={saving}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {saving ? 'Cancelling…' : 'Cancel booking'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
