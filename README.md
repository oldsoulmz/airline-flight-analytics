# ✈️ Airline Flight Analytics Dashboard

A full-stack flight operations analytics dashboard built with **Node.js + Express + SQLite** (backend) and **React + TypeScript + Vite + Tailwind + Recharts** (frontend).

---

## Features

| Section | Details |
|---|---|
| **Dashboard** | KPI cards, route map, top delayed routes, recent activity |
| **Flights** | Filterable table by status & airline, pagination |
| **Delays** | Bar chart (top routes), line chart (30-day trend), by-airline breakdown |
| **Passengers** | Donut chart, occupancy table with progress bars |
| **Routes** | Interactive SVG route map + sortable route table |

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# 1. Install all dependencies
bash setup.sh

# 2. Start the backend (terminal 1)
cd backend
npm run dev

# 3. Start the frontend (terminal 2)
cd frontend
npm run dev

# 4. Open browser
open http://localhost:5173
```

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- SQLite via `better-sqlite3`
- Auto-seeds 22 airports, 45 routes, 600 flights on first run

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS (dark theme)
- Recharts (bar, line, donut charts)
- React Router v6

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/airports` | All airports |
| GET | `/api/routes` | All routes with stats |
| GET | `/api/flights` | Flights (filterable: `status`, `airline`, `page`, `limit`) |
| GET | `/api/flights/delays` | Delay stats: by route, over time, by airline |
| GET | `/api/passengers/summary` | Occupancy rates per route |
| GET | `/api/dashboard/summary` | KPIs + top delayed routes + recent activity |

---

## Project Structure

```
airline-analytics/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts       ← DB init + connection
│   │   │   └── seed.ts         ← 600 flights seed data
│   │   ├── routes/
│   │   │   ├── airports.ts
│   │   │   ├── routes.ts
│   │   │   ├── flights.ts      ← also /delays endpoint
│   │   │   ├── passengers.ts
│   │   │   └── dashboard.ts
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/index.ts        ← typed fetch helpers
│   │   ├── components/
│   │   │   ├── KpiCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DelayCharts.tsx
│   │   │   ├── PassengerChart.tsx
│   │   │   └── RouteMap.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Flights.tsx
│   │   │   ├── Delays.tsx
│   │   │   ├── Passengers.tsx
│   │   │   └── Routes.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── setup.sh
```
