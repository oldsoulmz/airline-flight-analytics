import type { Route } from '../api';

interface RouteMapProps {
  routes: Route[];
}

// Equirectangular map projection helpers
const MAP_W = 1000;
const MAP_H = 500;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return [x, y];
}

const AIRLINE_COLORS: Record<string, string> = {
  Delta: '#3b82f6',
  United: '#8b5cf6',
  American: '#ef4444',
  Southwest: '#f59e0b',
  Emirates: '#10b981',
  Lufthansa: '#06b6d4',
  'British Airways': '#ec4899',
  'Air France': '#6366f1',
  'Singapore Airlines': '#f97316',
  Qantas: '#84cc16',
};

export default function RouteMap({ routes }: RouteMapProps) {
  const airlines = [...new Set(routes.map(r => r.airline))];

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Flight Route Network</h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {airlines.map(a => (
          <div key={a} className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full inline-block" style={{ backgroundColor: AIRLINE_COLORS[a] ?? '#6b7280' }} />
            <span className="text-xs text-gray-400">{a}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full bg-gray-950 rounded-lg" style={{ minWidth: 600 }}>
          {/* Simple world background grid */}
          {[-60, -30, 0, 30, 60].map(lat => {
            const [, y] = project(lat, 0);
            return <line key={lat} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#1f2937" strokeWidth={0.5} />;
          })}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lng => {
            const [x] = project(0, lng);
            return <line key={lng} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#1f2937" strokeWidth={0.5} />;
          })}

          {/* Route lines */}
          {routes.map(route => {
            const [ox, oy] = project(route.origin_lat, route.origin_lng);
            const [dx, dy] = project(route.destination_lat, route.destination_lng);
            const color = AIRLINE_COLORS[route.airline] ?? '#6b7280';
            return (
              <line
                key={route.id}
                x1={ox} y1={oy}
                x2={dx} y2={dy}
                stroke={color}
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Airport dots */}
          {routes.flatMap(r => [
            { code: r.origin_code, lat: r.origin_lat, lng: r.origin_lng, city: r.origin_city },
            { code: r.destination_code, lat: r.destination_lat, lng: r.destination_lng, city: r.destination_city },
          ])
            .filter((a, i, arr) => arr.findIndex(b => b.code === a.code) === i)
            .map(airport => {
              const [x, y] = project(airport.lat, airport.lng);
              return (
                <g key={airport.code}>
                  <circle cx={x} cy={y} r={4} fill="#3b82f6" stroke="#1e3a8a" strokeWidth={1.5} />
                  <text x={x + 6} y={y + 4} fontSize={9} fill="#93c5fd">{airport.code}</text>
                </g>
              );
            })}
        </svg>
      </div>

      <p className="text-xs text-gray-600 mt-2 text-center">
        {routes.length} routes across {[...new Set(routes.flatMap(r => [r.origin_code, r.destination_code]))].length} airports
      </p>
    </div>
  );
}
