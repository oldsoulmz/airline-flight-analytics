import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';

const router = Router();

// GET /api/flights?status=delayed&airline=Delta&page=1&limit=50
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { status, airline, page = '1', limit = '50' } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (status) {
    conditions.push('f.status = ?');
    params.push(status);
  }
  if (airline) {
    conditions.push('r.airline = ?');
    params.push(airline);
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const total = (db.prepare(`
    SELECT COUNT(*) as count
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    ${where}
  `).get(...params) as { count: number }).count;

  const flights = db.prepare(`
    SELECT
      f.id,
      f.flight_number,
      f.scheduled_departure,
      f.actual_departure,
      f.delay_minutes,
      f.status,
      r.airline,
      r.distance_km,
      o.iata_code AS origin_code,
      o.city AS origin_city,
      d.iata_code AS destination_code,
      d.city AS destination_city
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    JOIN airports o ON r.origin_id = o.id
    JOIN airports d ON r.destination_id = d.id
    ${where}
    ORDER BY f.scheduled_departure DESC
    LIMIT ? OFFSET ?
  `).all(...params, limitNum, offset);

  res.json({ total, page: pageNum, limit: limitNum, data: flights });
});

// GET /api/flights/delays — delay stats per route and over time
router.get('/delays', (_req: Request, res: Response) => {
  const db = getDb();

  const byRoute = db.prepare(`
    SELECT
      o.iata_code || ' → ' || d.iata_code AS route,
      r.airline,
      COUNT(f.id) AS total_flights,
      SUM(CASE WHEN f.status != 'on-time' AND f.status != 'cancelled' THEN 1 ELSE 0 END) AS delayed_flights,
      ROUND(AVG(CASE WHEN f.delay_minutes > 0 THEN f.delay_minutes END), 1) AS avg_delay_minutes,
      MAX(f.delay_minutes) AS max_delay_minutes,
      SUM(CASE WHEN f.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_flights
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    JOIN airports o ON r.origin_id = o.id
    JOIN airports d ON r.destination_id = d.id
    GROUP BY r.id
    ORDER BY avg_delay_minutes DESC
    LIMIT 20
  `).all();

  const overTime = db.prepare(`
    SELECT
      DATE(f.scheduled_departure) AS date,
      COUNT(*) AS total_flights,
      SUM(CASE WHEN f.delay_minutes > 0 THEN 1 ELSE 0 END) AS delayed_flights,
      ROUND(AVG(f.delay_minutes), 1) AS avg_delay
    FROM flights f
    WHERE f.scheduled_departure >= DATE('now', '-30 days')
    GROUP BY DATE(f.scheduled_departure)
    ORDER BY date ASC
  `).all();

  const byAirline = db.prepare(`
    SELECT
      r.airline,
      COUNT(f.id) AS total_flights,
      SUM(CASE WHEN f.delay_minutes > 0 THEN 1 ELSE 0 END) AS delayed_flights,
      ROUND(AVG(f.delay_minutes), 1) AS avg_delay
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    GROUP BY r.airline
    ORDER BY avg_delay DESC
  `).all();

  res.json({ byRoute, overTime, byAirline });
});

export default router;
