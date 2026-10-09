import { getDb } from './schema';

const airports = [
  { iata_code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', latitude: 40.6413, longitude: -73.7781 },
  { iata_code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', latitude: 33.9425, longitude: -118.408 },
  { iata_code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', latitude: 41.9742, longitude: -87.9073 },
  { iata_code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', latitude: 33.6407, longitude: -84.4277 },
  { iata_code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', latitude: 32.8998, longitude: -97.0403 },
  { iata_code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', latitude: 37.6213, longitude: -122.379 },
  { iata_code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', latitude: 25.7959, longitude: -80.287 },
  { iata_code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', latitude: 47.4502, longitude: -122.3088 },
  { iata_code: 'BOS', name: 'Boston Logan International', city: 'Boston', country: 'USA', latitude: 42.3656, longitude: -71.0096 },
  { iata_code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', latitude: 39.8561, longitude: -104.6737 },
  { iata_code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', latitude: 51.477, longitude: -0.4613 },
  { iata_code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
  { iata_code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
  { iata_code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3086, longitude: 4.7639 },
  { iata_code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', latitude: 25.2528, longitude: 55.3644 },
  { iata_code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
  { iata_code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798 },
  { iata_code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753 },
  { iata_code: 'GRU', name: 'São Paulo Guarulhos', city: 'São Paulo', country: 'Brazil', latitude: -23.4356, longitude: -46.4731 },
  { iata_code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248 },
  { iata_code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', latitude: 19.4363, longitude: -99.0721 },
  { iata_code: 'ICN', name: 'Seoul Incheon International', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407 },
];

const airlines = ['Delta', 'United', 'American', 'Southwest', 'Emirates', 'Lufthansa', 'British Airways', 'Air France', 'Singapore Airlines', 'Qantas'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function seed() {
  const db = getDb();

  const existing = db.prepare('SELECT COUNT(*) as count FROM airports').get() as { count: number };
  if (existing.count > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  console.log('Seeding airports...');
  const insertAirport = db.prepare(
    'INSERT INTO airports (iata_code, name, city, country, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const a of airports) {
    insertAirport.run(a.iata_code, a.name, a.city, a.country, a.latitude, a.longitude);
  }

  console.log('Seeding routes...');
  const allAirports = db.prepare('SELECT id, iata_code FROM airports').all() as { id: number; iata_code: string }[];
  const insertRoute = db.prepare(
    'INSERT INTO routes (origin_id, destination_id, airline, distance_km) VALUES (?, ?, ?, ?)'
  );

  const routePairs = new Set<string>();
  const routes: { id: number }[] = [];

  while (routePairs.size < 45) {
    const origin = randomChoice(allAirports);
    const destination = randomChoice(allAirports);
    if (origin.id === destination.id) continue;
    const key = `${Math.min(origin.id, destination.id)}-${Math.max(origin.id, destination.id)}`;
    if (routePairs.has(key)) continue;
    routePairs.add(key);

    const result = insertRoute.run(origin.id, destination.id, randomChoice(airlines), randomInt(300, 15000));
    routes.push({ id: result.lastInsertRowid as number });
  }

  console.log('Seeding flights and passengers...');
  const insertFlight = db.prepare(
    `INSERT INTO flights (route_id, flight_number, scheduled_departure, actual_departure, delay_minutes, status)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const insertPassenger = db.prepare(
    `INSERT INTO passengers (flight_id, total_seats, booked_seats, occupancy_rate) VALUES (?, ?, ?, ?)`
  );

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 30);

  db.exec('BEGIN');
  try {
    for (let i = 0; i < 600; i++) {
      const route = randomChoice(routes);
      const daysOffset = randomInt(0, 30);
      const hoursOffset = randomInt(0, 23);
      const minutesOffset = randomInt(0, 59);

      const scheduled = new Date(baseDate);
      scheduled.setDate(scheduled.getDate() + daysOffset);
      scheduled.setHours(hoursOffset, minutesOffset, 0, 0);

      const delayChance = Math.random();
      let delay = 0;
      let status = 'on-time';

      if (delayChance < 0.08) {
        status = 'cancelled';
        delay = 0;
      } else if (delayChance < 0.25) {
        delay = randomInt(15, 180);
        status = delay > 60 ? 'major-delay' : 'delayed';
      }

      const actual = status === 'cancelled' ? null : addMinutes(scheduled, delay).toISOString();

      const flightResult = insertFlight.run(
        route.id,
        `FL${String(1000 + i).slice(1)}`,
        scheduled.toISOString(),
        actual,
        delay,
        status
      );

      const totalSeats = randomInt(120, 350);
      const booked = randomInt(Math.floor(totalSeats * 0.45), totalSeats);
      const occupancy = parseFloat((booked / totalSeats).toFixed(4));

      insertPassenger.run(flightResult.lastInsertRowid, totalSeats, booked, occupancy);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  console.log('✅ Seed complete: 22 airports, 45 routes, 600 flights, 600 passenger records.');
}

seed();
