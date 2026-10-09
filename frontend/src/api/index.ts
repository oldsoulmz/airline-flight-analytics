// Typed API helpers

export interface Airport {
  id: number;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  id: number;
  airline: string;
  distance_km: number;
  origin_code: string;
  origin_city: string;
  origin_country: string;
  origin_lat: number;
  origin_lng: number;
  destination_code: string;
  destination_city: string;
  destination_country: string;
  destination_lat: number;
  destination_lng: number;
  total_flights: number;
  avg_delay: number;
}

export interface Flight {
  id: number;
  flight_number: string;
  scheduled_departure: string;
  actual_departure: string | null;
  delay_minutes: number;
  status: string;
  airline: string;
  distance_km: number;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
}

export interface FlightsResponse {
  total: number;
  page: number;
  limit: number;
  data: Flight[];
}

export interface DashboardSummary {
  kpi: {
    total_flights: number;
    on_time_flights: number;
    delayed_flights: number;
    cancelled_flights: number;
    avg_delay_minutes: number;
    total_passengers: number;
    avg_occupancy_pct: number;
    on_time_pct: number;
  };
  topDelayedRoutes: { route: string; airline: string; avg_delay: number }[];
  recentActivity: {
    flight_number: string;
    status: string;
    delay_minutes: number;
    scheduled_departure: string;
    origin: string;
    destination: string;
    airline: string;
  }[];
}

export interface DelayStats {
  byRoute: {
    route: string;
    airline: string;
    total_flights: number;
    delayed_flights: number;
    avg_delay_minutes: number;
    max_delay_minutes: number;
    cancelled_flights: number;
  }[];
  overTime: {
    date: string;
    total_flights: number;
    delayed_flights: number;
    avg_delay: number;
  }[];
  byAirline: {
    airline: string;
    total_flights: number;
    delayed_flights: number;
    avg_delay: number;
  }[];
}

export interface PassengerSummary {
  overall: {
    total_seats: number;
    total_booked: number;
    avg_occupancy_pct: number;
  };
  byRoute: {
    route: string;
    airline: string;
    total_flights: number;
    total_seats: number;
    total_booked: number;
    avg_occupancy_pct: number;
  }[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export const api = {
  getDashboardSummary: () => fetchJson<DashboardSummary>('/api/dashboard/summary'),
  getAirports: () => fetchJson<Airport[]>('/api/airports'),
  getRoutes: () => fetchJson<Route[]>('/api/routes'),
  getFlights: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJson<FlightsResponse>(`/api/flights${qs}`);
  },
  getDelays: () => fetchJson<DelayStats>('/api/flights/delays'),
  getPassengerSummary: () => fetchJson<PassengerSummary>('/api/passengers/summary'),
};
