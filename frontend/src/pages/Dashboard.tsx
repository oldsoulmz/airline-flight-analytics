import { useEffect, useState } from 'react';
import { api, type DashboardSummary, type Route } from '../api';
import KpiCard from '../components/KpiCard';
import RouteMap from '../components/RouteMap';

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    'on-time': 'badge-on-time',
    'delayed': 'badge-delayed',
    'major-delay': 'badge-major-delay',
    'cancelled': 'badge-cancelled',
  };
  const label: Record<string, string> = {
    'on-time': 'On Time',
    'delayed': 'Delayed',
    'major-delay': 'Major Delay',
    'cancelled': 'Cancelled',
  };
  return <span className={cls[status] ?? 'badge-on-time'}>{label[status] ?? status}</span>;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getDashboardSummary(), api.getRoutes()])
      .then(([s, r]) => { setSummary(s); setRoutes(r); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading dashboard…</div>;
  if (error) return <div className="flex-1 flex items-center justify-center text-red-400">Error: {error}</div>;
  if (!summary) return null;

  const { kpi, topDelayedRoutes, recentActivity } = summary;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Operations Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Live flight analytics overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon="✈️" title="Total Flights" value={kpi.total_flights.toLocaleString()} color="blue" />
        <KpiCard icon="✅" title="On-Time %" value={`${kpi.on_time_pct}%`} subtitle={`${kpi.on_time_flights} flights`} color="emerald" />
        <KpiCard icon="⏱️" title="Avg Delay" value={`${kpi.avg_delay_minutes} min`} subtitle={`${kpi.delayed_flights} delayed`} color="amber" />
        <KpiCard icon="👥" title="Passengers" value={kpi.total_passengers.toLocaleString()} subtitle={`${kpi.avg_occupancy_pct}% occupancy`} color="violet" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <KpiCard icon="❌" title="Cancelled" value={kpi.cancelled_flights} color="red" />
        <KpiCard icon="💺" title="Avg Occupancy" value={`${kpi.avg_occupancy_pct}%`} color="violet" />
      </div>

      {/* Route Map */}
      <RouteMap routes={routes} />

      {/* Bottom two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Delayed Routes */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Delayed Routes</h3>
          <div className="space-y-2">
            {topDelayedRoutes.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
                <div>
                  <span className="text-xs font-mono text-blue-300">{r.route}</span>
                  <span className="text-xs text-gray-500 ml-2">{r.airline}</span>
                </div>
                <span className="text-xs font-semibold text-amber-400">{r.avg_delay} min</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
                <div>
                  <span className="text-xs font-mono text-white">{f.flight_number}</span>
                  <span className="text-xs text-gray-500 ml-2">{f.origin} → {f.destination}</span>
                  <span className="text-xs text-gray-600 ml-1 hidden sm:inline">{f.airline}</span>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
