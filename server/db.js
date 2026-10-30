import fs from 'node:fs'
import path from 'node:path'
import { AppError } from './errors.js'

// Worked out on every call so tests can point GETFIT_DB_PATH at a temp file
export function getDbPath() {
  return process.env.GETFIT_DB_PATH || path.join(process.cwd(), 'data', 'db.json')
}

// turbopackIgnore stops Next from tracing the whole project because the path isn't static
export function readDb() {
  const dbPath = getDbPath()
  if (!fs.existsSync(/* turbopackIgnore: true */ dbPath)) {
    throw new AppError(500, 'No data found. Run npm run db:reset first.')
  }
  return JSON.parse(fs.readFileSync(/* turbopackIgnore: true */ dbPath, 'utf8'))
}

export function writeDb(data) {
  fs.writeFileSync(/* turbopackIgnore: true */ getDbPath(), JSON.stringify(data, null, 2) + '\n')
}
