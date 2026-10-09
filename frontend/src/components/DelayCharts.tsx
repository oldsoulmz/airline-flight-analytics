import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import type { DelayStats } from '../api';

interface DelayChartsProps {
  data: DelayStats;
}

export default function DelayCharts({ data }: DelayChartsProps) {
  const top10Routes = data.byRoute.slice(0, 10).map(r => ({
    route: r.route,
    avg_delay: r.avg_delay_minutes ?? 0,
    airline: r.airline,
  }));

  return (
    <div className="space-y-6">
      {/* Top 10 Delayed Routes - Bar Chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Top 10 Delayed Routes (avg minutes)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={top10Routes} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="route"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              angle={-40}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} unit=" min" />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }}
              formatter={(val: number) => [`${val} min`, 'Avg Delay']}
            />
            <Bar dataKey="avg_delay" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Delays Over Time - Line Chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Daily Delay Trend (last 30 days)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.overTime} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickFormatter={d => d.slice(5)}
            />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Line type="monotone" dataKey="avg_delay" stroke="#3b82f6" strokeWidth={2} dot={false} name="Avg Delay (min)" />
            <Line type="monotone" dataKey="delayed_flights" stroke="#f59e0b" strokeWidth={2} dot={false} name="Delayed Flights" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* By Airline - Bar Chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Average Delay by Airline</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.byAirline} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="airline" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} unit=" min" />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }}
              formatter={(val: number) => [`${val} min`, 'Avg Delay']}
            />
            <Bar dataKey="avg_delay" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
