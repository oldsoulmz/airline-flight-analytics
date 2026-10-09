import { Router } from 'express';
import { getDb } from '../db/schema';

const router = Router();

router.get('/summary', (_req, res) => {
  const db = getDb();

  const totals = db.prepare(`
    SELECT
      COUNT(*) AS total_flights,
      SUM(CASE WHEN status = 'on-time' THEN 1 ELSE 0 END) AS on_time_flights,
      SUM(CASE WHEN status = 'delayed' OR status = 'major-delay' THEN 1 ELSE 0 END) AS delayed_flights,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_flights,
      ROUND(AVG(delay_minutes), 1) AS avg_delay_minutes
    FROM flights
  `).get() as {
    total_flights: number;
    on_time_flights: number;
    delayed_flights: number;
    cancelled_flights: number;
    avg_delay_minutes: number;
  };

  const passengers = db.prepare(`
    SELECT
      SUM(booked_seats) AS total_passengers,
      ROUND(AVG(occupancy_rate) * 100, 1) AS avg_occupancy_pct
    FROM passengers
  `).get() as { total_passengers: number; avg_occupancy_pct: number };

  const onTimePct = totals.total_flights > 0
    ? parseFloat(((totals.on_time_flights / totals.total_flights) * 100).toFixed(1))
    : 0;

  const topDelayedRoutes = db.prepare(`
    SELECT
      o.iata_code || ' → ' || d.iata_code AS route,
      r.airline,
      ROUND(AVG(f.delay_minutes), 1) AS avg_delay
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    JOIN airports o ON r.origin_id = o.id
    JOIN airports d ON r.destination_id = d.id
    WHERE f.delay_minutes > 0
    GROUP BY r.id
    ORDER BY avg_delay DESC
    LIMIT 10
  `).all();

  const recentActivity = db.prepare(`
    SELECT
      f.flight_number,
      f.status,
      f.delay_minutes,
      f.scheduled_departure,
      o.iata_code AS origin,
      d.iata_code AS destination,
      r.airline
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    JOIN airports o ON r.origin_id = o.id
    JOIN airports d ON r.destination_id = d.id
    ORDER BY f.scheduled_departure DESC
    LIMIT 8
  `).all();

  res.json({
    kpi: {
      total_flights: totals.total_flights,
      on_time_flights: totals.on_time_flights,
      delayed_flights: totals.delayed_flights,
      cancelled_flights: totals.cancelled_flights,
      avg_delay_minutes: totals.avg_delay_minutes,
      total_passengers: passengers.total_passengers,
      avg_occupancy_pct: passengers.avg_occupancy_pct,
      on_time_pct: onTimePct,
    },
    topDelayedRoutes,
    recentActivity,
  });
});

export default router;
