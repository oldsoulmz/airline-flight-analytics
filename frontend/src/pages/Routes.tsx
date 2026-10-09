import { useEffect, useState } from 'react';
import { api, type Route } from '../api';
import RouteMap from '../components/RouteMap';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airlineFilter, setAirlineFilter] = useState('');

  useEffect(() => {
    api.getRoutes()
      .then(setRoutes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const airlines = [...new Set(routes.map(r => r.airline))].sort();
  const filtered = airlineFilter ? routes.filter(r => r.airline === airlineFilter) : routes;

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading routes…</div>;
  if (error) return <div className="flex-1 flex items-center justify-center text-red-400">Error: {error}</div>;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Flight Routes</h1>
        <p className="text-sm text-gray-500 mt-0.5">{routes.length} routes across the network</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={airlineFilter}
          onChange={e => setAirlineFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Airlines</option>
          {airlines.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <span className="text-xs text-gray-500 self-center">{filtered.length} routes shown</span>
      </div>

      {/* Map */}
      <RouteMap routes={filtered} />

      {/* Routes table */}
      <div className="card overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Route Details</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-2 pr-4 font-medium">Origin</th>
              <th className="pb-2 pr-4 font-medium">Destination</th>
              <th className="pb-2 pr-4 font-medium">Airline</th>
              <th className="pb-2 pr-4 font-medium text-right">Distance</th>
              <th className="pb-2 pr-4 font-medium text-right">Flights</th>
              <th className="pb-2 font-medium text-right">Avg Delay</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-2 pr-4">
                  <span className="font-mono text-blue-300 text-xs">{r.origin_code}</span>
                  <span className="text-gray-500 text-xs ml-1">{r.origin_city}</span>
                </td>
                <td className="py-2 pr-4">
                  <span className="font-mono text-blue-300 text-xs">{r.destination_code}</span>
                  <span className="text-gray-500 text-xs ml-1">{r.destination_city}</span>
                </td>
                <td className="py-2 pr-4 text-gray-400 text-xs">{r.airline}</td>
                <td className="py-2 pr-4 text-right text-gray-400 text-xs">{r.distance_km.toLocaleString()} km</td>
                <td className="py-2 pr-4 text-right text-gray-400">{r.total_flights}</td>
                <td className="py-2 text-right">
                  <span className={r.avg_delay > 30 ? 'text-amber-400' : 'text-gray-400'}>
                    {r.avg_delay != null ? `${Number(r.avg_delay).toFixed(1)} min` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
