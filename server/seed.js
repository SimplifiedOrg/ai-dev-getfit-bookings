import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { addDays, formatDay, hoursUntil, startOfWeek } from '../lib/dates.js'
import { getDbPath } from './db.js'

const BACKGROUND_MEMBERS = [
  'Riley Brooks',
  'Taylor Reid',
  'Jamie Clarke',
  'Noah Kim',
  'Mia Thompson',
  "Liam O'Connor",
  'Zara Ahmed',
  'Ethan Wright',
  'Grace Liu',
  'Sophie Martin',
]

const CLASS_TYPES = [
  {
    id: 'ct_yoga',
    name: 'Yoga',
    colour: 'green',
    description: 'A steady flow to build strength, balance and flexibility. All levels welcome, and mats are provided.',
    instructorId: 'i_priya',
    durationMins: 60,
    capacity: 15,
    studio: 'Studio 2',
  },
  {
    id: 'ct_hiit',
    name: 'HIIT',
    colour: 'orange',
    description: 'Short, sharp intervals that get your heart rate up. Expect bodyweight moves, kettlebells and plenty of sweat.',
    instructorId: 'i_ben',
    durationMins: 45,
    capacity: 12,
    studio: 'Studio 3',
  },
  {
    id: 'ct_spin',
    name: 'Spin',
    colour: 'blue',
    description: 'Indoor cycling set to music, with climbs, sprints and intervals. Bring a towel and a water bottle.',
    instructorId: 'i_kim',
    durationMins: 45,
    capacity: 8,
    studio: 'Studio 1',
  },
  {
    id: 'ct_pilates',
    name: 'Pilates',
    colour: 'purple',
    description: 'Slow, controlled movements that work your core and posture. A great match for any other training.',
    instructorId: 'i_sofia',
    durationMins: 50,
    capacity: 10,
    studio: 'Studio 2',
  },
]

const INSTRUCTORS = [
  { id: 'i_priya', name: 'Priya Sharma', bio: 'Has taught yoga for ten years and never rushes a stretch.' },
  { id: 'i_ben', name: 'Ben Walker', bio: 'Former rugby player who keeps every session fast and fun.' },
  { id: 'i_kim', name: 'Kim Nguyen', bio: 'Ex-track cyclist who never skips the big climb.' },
  { id: 'i_sofia', name: 'Sofia Rossi', bio: 'Physio-trained teacher with a sharp eye for good form.' },
]

// Same every week. Index 0 is Monday.
const WEEKLY_TIMETABLE = [
  [['6:30', 'ct_hiit'], ['9:30', 'ct_yoga'], ['12:15', 'ct_pilates'], ['18:00', 'ct_spin']],
  [['6:30', 'ct_spin'], ['9:30', 'ct_pilates'], ['18:00', 'ct_hiit'], ['19:15', 'ct_yoga']],
  [['6:30', 'ct_hiit'], ['12:15', 'ct_yoga'], ['18:00', 'ct_spin'], ['19:15', 'ct_pilates']],
  [['6:30', 'ct_spin'], ['9:30', 'ct_yoga'], ['18:00', 'ct_hiit']],
  [['6:30', 'ct_hiit'], ['12:15', 'ct_pilates'], ['17:30', 'ct_spin']],
  [['8:00', 'ct_yoga'], ['9:00', 'ct_spin'], ['10:30', 'ct_hiit']],
  [['9:00', 'ct_pilates'], ['10:30', 'ct_yoga']],
]

const pad = (n) => String(n).padStart(3, '0')

function buildPeople() {
  const members = [
    { id: 'm_alex', name: 'Alex Chen', email: 'alex@getfit.test', membershipTier: 'CASUAL' },
    { id: 'm_jordan', name: 'Jordan Patel', email: 'jordan@getfit.test', membershipTier: 'UNLIMITED' },
  ]
  for (const name of BACKGROUND_MEMBERS) {
    const first = name.split(' ')[0].toLowerCase()
    members.push({ id: `m_${first}`, name, email: `${first}@getfit.test`, membershipTier: 'UNLIMITED' })
  }
  const staff = [{ id: 's_morgan', name: 'Morgan Lee', email: 'morgan@getfit.test' }]
  return { members, staff }
}

function buildSessions(now) {
  const firstWeek = addDays(startOfWeek(now), -7)
  const sessions = []

  for (let week = 0; week < 3; week++) {
    WEEKLY_TIMETABLE.forEach((classes, dayIndex) => {
      for (const [time, classTypeId] of classes) {
        const [hours, minutes] = time.split(':').map(Number)
        const startsAt = addDays(firstWeek, week * 7 + dayIndex)
        startsAt.setHours(hours, minutes, 0, 0)

        const type = CLASS_TYPES.find((t) => t.id === classTypeId)
        sessions.push({
          id: `ses_${pad(sessions.length + 1)}`,
          classTypeId,
          instructorId: type.instructorId,
          studio: type.studio,
          startsAt: startsAt.toISOString(),
          durationMins: type.durationMins,
          capacity: type.capacity,
        })
      }
    })
  }
  return sessions
}

const isSaturday = (session) => new Date(session.startsAt).getDay() === 6
const isAtNine = (session) => {
  const d = new Date(session.startsAt)
  return d.getHours() === 9 && d.getMinutes() === 0
}

function findKeySession(sessions, now) {
  return sessions.find(
    (s) => s.classTypeId === 'ct_spin' && isSaturday(s) && isAtNine(s) && hoursUntil(s.startsAt, now) >= 24
  )
}

export function buildSeed(now = new Date()) {
  const { members, staff } = buildPeople()
  const sessions = buildSessions(now)
  const background = members.slice(2).map((m) => m.id)
  const bookings = []

  const hoursAway = (session) => hoursUntil(session.startsAt, now)
  const sameWeekAs = (a, b) => startOfWeek(a.startsAt).getTime() === startOfWeek(b.startsAt).getTime()

  function book(memberId, session, status = 'BOOKED') {
    // A day or two before the class, but never in the future
    const daysBefore = 1 + (bookings.length % 2)
    const created = Math.min(
      addDays(session.startsAt, -daysBefore).getTime(),
      now.getTime() - (bookings.length % 48 + 1) * 60 * 60 * 1000
    )
    bookings.push({
      id: `b_${pad(bookings.length + 1)}`,
      memberId,
      sessionId: session.id,
      status,
      createdAt: new Date(created).toISOString(),
    })
  }

  // Saturday 9am Spin, at least a day away, and full
  const keySession = findKeySession(sessions, now)
  book('m_jordan', keySession)
  background.slice(0, keySession.capacity - 1).forEach((id) => book(id, keySession))

  const inKeyWeek = sessions.filter((s) => sameWeekAs(s, keySession) && hoursAway(s) >= 3)

  // Alex is new: one upcoming class and nothing in the past
  const alexSession = inKeyWeek.find((s) => s.classTypeId === 'ct_yoga' && !isSaturday(s))
  book('m_alex', alexSession)

  // One class with a single spot left
  const almostFull = inKeyWeek.find((s) => s.classTypeId === 'ct_pilates')
  background.slice(0, almostFull.capacity - 1).forEach((id) => book(id, almostFull))

  const jordanUpcoming = sessions
    .filter(
      (s) =>
        hoursAway(s) >= 3 &&
        !isSaturday(s) &&
        s.classTypeId === 'ct_hiit' &&
        s.id !== almostFull.id
    )
    .slice(0, 2)
  jordanUpcoming.forEach((s) => book('m_jordan', s))

  const lastWeekSpin = sessions.filter((s) => s.classTypeId === 'ct_spin' && !isSaturday(s)).slice(0, 3)
  book('m_jordan', lastWeekSpin[0])
  book('m_jordan', lastWeekSpin[1])
  book('m_jordan', lastWeekSpin[2], 'CANCELLED')

  // Everyone else: a steady pattern so nothing else looks full
  sessions.forEach((session, i) => {
    if (session.id === keySession.id || session.id === almostFull.id) return

    const alreadyBooked = bookings.filter((b) => b.sessionId === session.id && b.status === 'BOOKED').length
    const max = Math.min(session.capacity - 3, background.length)
    const target = 2 + ((i * 7) % (max - 1))
    for (let j = 0; j < target - alreadyBooked; j++) {
      book(background[(i + j) % background.length], session)
    }
  })

  return {
    members,
    staff,
    instructors: INSTRUCTORS,
    classTypes: CLASS_TYPES.map(({ id, name, colour, description }) => ({ id, name, colour, description })),
    sessions,
    bookings,
  }
}

function resetDb() {
  const now = new Date()
  const data = buildSeed(now)
  const dbPath = getDbPath()
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2) + '\n')

  const keySession = findKeySession(data.sessions, now)
  console.log(`Database reset. Saturday 9am Spin is on ${formatDay(keySession.startsAt)}.`)
}

// Only runs for `npm run db:reset`, not when tests import buildSeed
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  resetDb()
}
