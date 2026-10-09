import { Router } from 'express';
import { getDb } from '../db/schema';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const airports = db.prepare('SELECT * FROM airports ORDER BY country, city').all();
  res.json(airports);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const airport = db.prepare('SELECT * FROM airports WHERE id = ?').get(req.params.id);
  if (!airport) return res.status(404).json({ error: 'Airport not found' });
  res.json(airport);
});

export default router;
