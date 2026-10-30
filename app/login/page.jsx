'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircleCheck, Dumbbell } from 'lucide-react'
import { logIn } from '@/lib/requests/auth'

const SELLING_POINTS = [
  'See every class for this week and next',
  'Book or cancel in a couple of taps',
  'Keep all your bookings in one place',
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await logIn(email)
      router.push(user.role === 'STAFF' ? '/staff' : '/')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:mt-6 md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-600 p-10 text-white md:flex">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <Dumbbell size={18} aria-hidden="true" />
          </span>
          GetFit
        </div>

        <div>
          <p className="text-3xl leading-tight font-bold tracking-tight">Book your next class in seconds</p>
          <ul className="mt-6 space-y-3">
            {SELLING_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-brand-50">
                <CircleCheck size={18} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-brand-100">Yoga · HIIT · Spin · Pilates</p>
      </div>

      <div className="p-6 sm:p-10 md:p-12">
        <div className="mb-8 flex items-center gap-2 text-lg font-bold text-ink md:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Dumbbell size={18} aria-hidden="true" />
          </span>
          GetFit
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-ink">Log in to GetFit</h1>
        <p className="mt-1 text-sm text-slate-600">Enter the email on your membership.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
