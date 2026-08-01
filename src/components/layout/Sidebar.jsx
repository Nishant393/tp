import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import ShieldLogo from '../ui/ShieldLogo'

/** Desktop-only left sidebar navigation. */
export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 py-6">
        <ShieldLogo size={40} />
        <div>
          <p className="font-display font-bold text-sm leading-tight text-[#0A2E8A] dark:text-orange-400">
            Orange Multipurpose
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Security Service</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
        © {new Date().getFullYear()} OMSS. All rights reserved.
      </div>
    </aside>
  )
}
