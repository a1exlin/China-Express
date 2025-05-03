import sqlite3 from "sqlite3"
import { open } from "sqlite"

// Database connection pool
let dbInstance = null

export async function connectToDatabase(dbPath: string) {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  return dbInstance
}
