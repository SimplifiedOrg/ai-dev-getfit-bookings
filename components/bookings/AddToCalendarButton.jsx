'use client'

import { CalendarPlus } from 'lucide-react'
import { downloadIcs } from '@/lib/calendar'

export default function AddToCalendarButton({ session, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => downloadIcs(session)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 ${className}`}
    >
      <CalendarPlus size={16} aria-hidden="true" />
      Add to calendar
    </button>
  )
}
