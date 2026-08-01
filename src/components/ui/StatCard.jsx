import Card from './Card'

/** Dashboard metric card with icon, value, and label. */
export default function StatCard({ icon: Icon, label, value, accent = 'orange', loading }) {
  const accents = {
    orange: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    navy: 'bg-blue-50 dark:bg-blue-500/10 text-[#0A2E8A] dark:text-blue-400',
    green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  }
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {loading ? (
          <div className="mt-1.5 h-6 w-20 skeleton rounded" />
        ) : (
          <p className="mt-0.5 truncate font-display text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        )}
      </div>
    </Card>
  )
}
