import { Router } from 'express';
import { getDb } from '../db/schema';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const routes = db.prepare(`
    SELECT
      r.id,
      r.airline,
      r.distance_km,
      o.iata_code AS origin_code,
      o.city AS origin_city,
      o.country AS origin_country,
      o.latitude AS origin_lat,
      o.longitude AS origin_lng,
      d.iata_code AS destination_code,
      d.city AS destination_city,
      d.country AS destination_country,
      d.latitude AS destination_lat,
      d.longitude AS destination_lng,
      COUNT(f.id) AS total_flights,
      AVG(f.delay_minutes) AS avg_delay
    FROM routes r
    JOIN airports o ON r.origin_id = o.id
    JOIN airports d ON r.destination_id = d.id
    LEFT JOIN flights f ON f.route_id = r.id
    GROUP BY r.id
    ORDER BY r.airline, o.iata_code
  `).all();
  res.json(routes);
});

export default router;
