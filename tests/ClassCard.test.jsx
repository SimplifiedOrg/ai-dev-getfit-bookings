// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ClassCard from '@/components/timetable/ClassCard'

function makeSession(overrides = {}) {
  return {
    id: 'ses_001',
    startsAt: new Date(2026, 10, 7, 9, 0).toISOString(),
    endsAt: new Date(2026, 10, 7, 9, 45).toISOString(),
    studio: 'Studio 1',
    classType: { id: 'ct_spin', name: 'Spin', colour: 'blue' },
    instructor: { id: 'i_kim', name: 'Kim Nguyen' },
    spotsLeft: 5,
    hasStarted: false,
    ...overrides,
  }
}

describe('ClassCard', () => {
  it('shows the class name, time and instructor', () => {
    render(<ClassCard session={makeSession()} />)

    expect(screen.getByText('Spin')).toBeInTheDocument()
    expect(screen.getByText('9:00 am – 9:45 am')).toBeInTheDocument()
    expect(screen.getByText('Kim Nguyen')).toBeInTheDocument()
  })

  it('shows how many spots are left', () => {
    render(<ClassCard session={makeSession({ spotsLeft: 5 })} />)

    expect(screen.getByText('5 spots left')).toBeInTheDocument()
  })

  it('shows Full when there are no spots', () => {
    render(<ClassCard session={makeSession({ spotsLeft: 0 })} />)

    expect(screen.getByText('Full')).toBeInTheDocument()
  })
})
