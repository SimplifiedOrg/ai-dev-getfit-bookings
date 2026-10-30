// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BookButton from '@/components/bookings/BookButton'
import { bookClass } from '@/lib/requests/bookings'

vi.mock('@/lib/requests/bookings', () => ({
  bookClass: vi.fn(),
}))

const session = { id: 'ses_001', spotsLeft: 3, hasStarted: false }

describe('BookButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows Book when there are spots', () => {
    render(<BookButton session={session} />)

    expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled()
  })

  it('shows a disabled Class full button when the class is full', () => {
    render(<BookButton session={{ ...session, spotsLeft: 0 }} />)

    expect(screen.getByRole('button', { name: 'Class full' })).toBeDisabled()
  })

  it('shows the error when booking fails', async () => {
    bookClass.mockRejectedValue(new Error('Casual members can book 3 classes a week.'))
    render(<BookButton session={session} />)

    await userEvent.click(screen.getByRole('button', { name: 'Book' }))

    expect(await screen.findByText('Casual members can book 3 classes a week.')).toBeInTheDocument()
  })
})
