import { describe, expect, it } from 'vitest'
import { overlaps, startOfWeek } from '../lib/dates.js'

describe('startOfWeek', () => {
  it('returns the Monday before a Sunday', () => {
    const sunday = new Date(2026, 10, 8, 15, 30)
    const monday = startOfWeek(sunday)

    expect(monday.getDay()).toBe(1)
    expect(monday.getDate()).toBe(2)
    expect(monday.getHours()).toBe(0)
  })
})

describe('overlaps', () => {
  const at = (hours, minutes = 0) => new Date(2026, 10, 4, hours, minutes)

  it('is true when two times overlap', () => {
    expect(overlaps(at(9), at(10), at(9, 30), at(10, 30))).toBe(true)
  })

  it('is false when one ends as the other starts', () => {
    expect(overlaps(at(9), at(10), at(10), at(11))).toBe(false)
  })
})
