import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PassengerSummary } from '../api';

interface PassengerChartProps {
  data: PassengerSummary;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
];

export default function PassengerChart({ data }: PassengerChartProps) {
  const top10 = data.byRoute.slice(0, 10).map((r, i) => ({
    name: r.route,
    value: parseFloat(r.avg_occupancy_pct.toFixed(1)),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Seats</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {data.overall.total_seats.toLocaleString()}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Booked</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {data.overall.total_booked.toLocaleString()}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Avg Occupancy</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">
            {data.overall.avg_occupancy_pct}%
          </p>
        </div>
      </div>

      {/* Donut chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Occupancy Rate by Route (Top 10)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={top10}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
            >
              {top10.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }}
              formatter={(val: number) => [`${val}%`, 'Occupancy']}
            />
            <Legend
              wrapperStyle={{ color: '#9ca3af', fontSize: 11 }}
              formatter={(value) => value.length > 20 ? value.slice(0, 20) + '…' : value}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Occupancy by Route</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-2 pr-4">Route</th>
              <th className="pb-2 pr-4">Airline</th>
              <th className="pb-2 pr-4 text-right">Flights</th>
              <th className="pb-2 pr-4 text-right">Booked</th>
              <th className="pb-2 text-right">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {data.byRoute.map((r, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-2 pr-4 font-mono text-xs text-blue-300">{r.route}</td>
                <td className="py-2 pr-4 text-gray-300">{r.airline}</td>
                <td className="py-2 pr-4 text-right text-gray-400">{r.total_flights}</td>
                <td className="py-2 pr-4 text-right text-gray-400">{r.total_booked.toLocaleString()}</td>
                <td className="py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(100, r.avg_occupancy_pct)}%` }}
                      />
                    </div>
                    <span className="text-gray-300 font-medium">{r.avg_occupancy_pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
