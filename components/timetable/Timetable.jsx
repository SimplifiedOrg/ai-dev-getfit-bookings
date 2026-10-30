'use client'

import { useState } from 'react'
import { addDays } from '@/lib/dates'
import DayColumn from './DayColumn'
import DayPicker from './DayPicker'

export default function Timetable({ weekStart, sessions }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const todayIndex = days.findIndex((day) => day.toDateString() === new Date().toDateString())
  const [selected, setSelected] = useState(Math.max(todayIndex, 0))

  const sessionsOn = (day) => sessions.filter((s) => new Date(s.startsAt).toDateString() === day.toDateString())

  return (
    <>
      {/* Phones and tablets: one day at a time. Seven columns need a wide screen. */}
      <div className="space-y-4 lg:hidden">
        <DayPicker days={days} selected={selected} onSelect={setSelected} />
        <DayColumn date={days[selected]} sessions={sessionsOn(days[selected])} />
      </div>

      <div className="hidden lg:grid lg:grid-cols-7 lg:gap-3">
        {days.map((day) => (
          <DayColumn key={day.toISOString()} date={day} sessions={sessionsOn(day)} />
        ))}
      </div>
    </>
  )
}
