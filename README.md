# GetFit Bookings

The GetFit member app. Members browse the class timetable, book and cancel classes, and see their bookings. Staff manage classes and see who's booked in.

## Tech stack

- Next.js (App Router) and React
- Tailwind CSS
- Vitest and React Testing Library
- Data is stored in a JSON file for now. We'll move to a real database later.

## Getting started

You'll need Node 24 or later.

    npm install
    npm run db:reset
    npm run dev

Then open http://localhost:3000.

Run the tests with `npm test`. Run `npm run db:reset` any time you want fresh data.

Times use your computer's local time.

## Booking policy

- Every class has a set capacity.
- Members can cancel up to 24 hours before a class.
