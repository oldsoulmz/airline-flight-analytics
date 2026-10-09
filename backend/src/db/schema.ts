// Uses Node.js built-in sqlite (available since Node 22.5+)
// No external SQLite dependency needed.
import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../flights.db');

let db: DatabaseSync;

export function getDb(): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    initSchema(db);
  }
  return db;
}

function initSchema(db: DatabaseSync): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS airports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      iata_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin_id INTEGER NOT NULL REFERENCES airports(id),
      destination_id INTEGER NOT NULL REFERENCES airports(id),
      airline TEXT NOT NULL,
      distance_km INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_id INTEGER NOT NULL REFERENCES routes(id),
      flight_number TEXT NOT NULL,
      scheduled_departure TEXT NOT NULL,
      actual_departure TEXT,
      delay_minutes INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'on-time'
    );

    CREATE TABLE IF NOT EXISTS passengers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flight_id INTEGER NOT NULL REFERENCES flights(id),
      total_seats INTEGER NOT NULL,
      booked_seats INTEGER NOT NULL,
      occupancy_rate REAL NOT NULL
    );
  `);
}
