import express from 'express';
import cors from 'cors';
import { seed } from './db/seed';
import airportsRouter from './routes/airports';
import routesRouter from './routes/routes';
import flightsRouter from './routes/flights';
import passengersRouter from './routes/passengers';
import dashboardRouter from './routes/dashboard';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Auto-seed on startup
seed();

// Routes
app.use('/api/airports', airportsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/flights', flightsRouter);
app.use('/api/passengers', passengersRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✈️  Airline Analytics API running on http://localhost:${PORT}`);
});
