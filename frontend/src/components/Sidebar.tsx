import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/flights', label: 'Flights', icon: '✈️' },
  { to: '/delays', label: 'Delays', icon: '⏱️' },
  { to: '/passengers', label: 'Passengers', icon: '👥' },
  { to: '/routes', label: 'Routes', icon: '🗺️' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Flight Analytics</p>
            <p className="text-xs text-gray-500">Operations Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-900 text-blue-200 font-medium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">Live data · Port 3001</p>
      </div>
    </aside>
  );
}
