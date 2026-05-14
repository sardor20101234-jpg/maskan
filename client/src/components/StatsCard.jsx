export default function StatsCard({ icon, label, value, color = 'primary', trend }) {
  const colors = {
    primary: 'from-primary-500 to-primary-700 shadow-primary-500/20',
    emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-500/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
    purple: 'from-purple-500 to-purple-700 shadow-purple-500/20',
    blue: 'from-blue-500 to-blue-700 shadow-blue-500/20',
    rose: 'from-rose-500 to-rose-600 shadow-rose-500/20',
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-lg hover:shadow-surface-100 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500">{label}</p>
          <p className="text-3xl font-bold text-surface-900 mt-1">{value ?? '—'}</p>
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center shadow-lg text-xl`}>
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
}
