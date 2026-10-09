import { useEffect, useState, useCallback } from 'react';
import { api, type FlightsResponse } from '../api';

const STATUSES = ['', 'on-time', 'delayed', 'major-delay', 'cancelled'];
const AIRLINES = ['', 'Delta', 'United', 'American', 'Southwest', 'Emirates', 'Lufthansa', 'British Airways', 'Air France', 'Singapore Airlines', 'Qantas'];

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

export default function FlightsPage() {
  const [data, setData] = useState<FlightsResponse | null>(null);
  const [status, setStatus] = useState('');
  const [airline, setAirline] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFlights = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '50' };
    if (status) params.status = status;
    if (airline) params.airline = airline;
    api.getFlights(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [status, airline, page]);

  useEffect(() => { fetchFlights(); }, [fetchFlights]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="flex-1 p-6 space-y-5 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Flights</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse and filter all flights</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s === '' ? 'All Statuses' : s}</option>)}
        </select>
        <select
          value={airline}
          onChange={e => { setAirline(e.target.value); setPage(1); }}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {AIRLINES.map(a => <option key={a} value={a}>{a === '' ? 'All Airlines' : a}</option>)}
        </select>
        {data && (
          <span className="text-xs text-gray-500 self-center">{data.total.toLocaleString()} flights</span>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3 pr-4 font-medium">Flight</th>
                <th className="pb-3 pr-4 font-medium">Route</th>
                <th className="pb-3 pr-4 font-medium">Airline</th>
                <th className="pb-3 pr-4 font-medium">Scheduled</th>
                <th className="pb-3 pr-4 font-medium text-right">Delay</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map(f => (
                <tr key={f.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-blue-300 text-xs">{f.flight_number}</td>
                  <td className="py-2.5 pr-4 text-gray-300">
                    <span className="font-medium">{f.origin_code}</span>
                    <span className="text-gray-600 mx-1">→</span>
                    <span className="font-medium">{f.destination_code}</span>
                    <span className="text-gray-600 text-xs ml-1 hidden md:inline">({f.origin_city})</span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-400 text-xs">{f.airline}</td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs">
                    {new Date(f.scheduled_departure).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-xs">
                    {f.delay_minutes > 0
                      ? <span className="text-amber-400 font-medium">+{f.delay_minutes} min</span>
                      : <span className="text-gray-600">—</span>
                    }
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 hover:bg-gray-700 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-400">Page {page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 hover:bg-gray-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
