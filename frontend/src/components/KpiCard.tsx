interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'violet';
  icon: string;
}

const colorMap = {
  blue: 'text-blue-400 bg-blue-950 border-blue-800',
  emerald: 'text-emerald-400 bg-emerald-950 border-emerald-800',
  amber: 'text-amber-400 bg-amber-950 border-amber-800',
  red: 'text-red-400 bg-red-950 border-red-800',
  violet: 'text-violet-400 bg-violet-950 border-violet-800',
};

export default function KpiCard({ title, value, subtitle, color = 'blue', icon }: KpiCardProps) {
  return (
    <div className={`card border ${colorMap[color].split(' ').slice(2).join(' ')}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colorMap[color].split(' ')[0]}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`text-2xl p-2 rounded-lg ${colorMap[color].split(' ').slice(1, 2).join(' ')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
