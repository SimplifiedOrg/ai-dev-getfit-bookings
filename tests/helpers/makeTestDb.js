import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildSeed } from '../../server/seed.js'

// Gives a test its own copy of the data, so data/db.json is never touched
export function makeTestDb(data = buildSeed()) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'getfit-test-'))
  const dbPath = path.join(dir, 'db.json')
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

  const previousPath = process.env.GETFIT_DB_PATH
  process.env.GETFIT_DB_PATH = dbPath

  return {
    path: dbPath,
    read: () => JSON.parse(fs.readFileSync(dbPath, 'utf8')),
    cleanup: () => {
      if (previousPath === undefined) delete process.env.GETFIT_DB_PATH
      else process.env.GETFIT_DB_PATH = previousPath
      fs.rmSync(dir, { recursive: true, force: true })
    },
  }
}
