import { useEffect, useState } from 'react';
import { api, type DelayStats } from '../api';
import DelayCharts from '../components/DelayCharts';

export default function DelaysPage() {
  const [data, setData] = useState<DelayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDelays()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading delay analytics…</div>;
  if (error) return <div className="flex-1 flex items-center justify-center text-red-400">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Delay Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Delay trends, route rankings, and airline performance</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.byAirline.slice(0, 4).map(a => (
          <div key={a.airline} className="card">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{a.airline}</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{a.avg_delay ?? 0} min</p>
            <p className="text-xs text-gray-600 mt-1">{a.delayed_flights} / {a.total_flights} delayed</p>
          </div>
        ))}
      </div>

      <DelayCharts data={data} />

      {/* Detailed route table */}
      <div className="card overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Full Route Delay Breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-2 pr-4 font-medium">Route</th>
              <th className="pb-2 pr-4 font-medium">Airline</th>
              <th className="pb-2 pr-4 font-medium text-right">Flights</th>
              <th className="pb-2 pr-4 font-medium text-right">Delayed</th>
              <th className="pb-2 pr-4 font-medium text-right">Avg Delay</th>
              <th className="pb-2 pr-4 font-medium text-right">Max Delay</th>
              <th className="pb-2 font-medium text-right">Cancelled</th>
            </tr>
          </thead>
          <tbody>
            {data.byRoute.map((r, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-2 pr-4 font-mono text-xs text-blue-300">{r.route}</td>
                <td className="py-2 pr-4 text-gray-400 text-xs">{r.airline}</td>
                <td className="py-2 pr-4 text-right text-gray-400">{r.total_flights}</td>
                <td className="py-2 pr-4 text-right text-amber-400">{r.delayed_flights}</td>
                <td className="py-2 pr-4 text-right text-gray-300 font-medium">{r.avg_delay_minutes ?? '—'} min</td>
                <td className="py-2 pr-4 text-right text-red-400">{r.max_delay_minutes} min</td>
                <td className="py-2 text-right text-red-300">{r.cancelled_flights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
