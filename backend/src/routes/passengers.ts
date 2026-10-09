import { Router } from 'express';
import { getDb } from '../db/schema';

const router = Router();

// GET /api/passengers/summary — occupancy per route
router.get('/summary', (_req, res) => {
  const db = getDb();

  const byRoute = db.prepare(`
    SELECT
      o.iata_code || ' → ' || d.iata_code AS route,
      r.airline,
      COUNT(p.id) AS total_flights,
      SUM(p.total_seats) AS total_seats,
      SUM(p.booked_seats) AS total_booked,
      ROUND(AVG(p.occupancy_rate) * 100, 1) AS avg_occupancy_pct
    FROM passengers p
    JOIN flights f ON p.flight_id = f.id
    JOIN routes r ON f.route_id = r.id
    JOIN airports o ON r.origin_id = o.id
    JOIN airports d ON r.destination_id = d.id
    GROUP BY r.id
    ORDER BY avg_occupancy_pct DESC
    LIMIT 20
  `).all();

  const overall = db.prepare(`
    SELECT
      SUM(p.total_seats) AS total_seats,
      SUM(p.booked_seats) AS total_booked,
      ROUND(AVG(p.occupancy_rate) * 100, 1) AS avg_occupancy_pct
    FROM passengers p
  `).get();

  res.json({ overall, byRoute });
});

export default router;
