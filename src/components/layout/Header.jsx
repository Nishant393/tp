import { useLocation } from 'react-router-dom'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import ShieldLogo from '../ui/ShieldLogo'

const TITLES = {
  '/': 'Dashboard',
  '/new-bill': 'New Bill',
  '/history': 'Bill History',
  '/settings': 'Settings',
}

/** Top header shown on all pages; carries page title and theme toggle. */
export default function Header() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const title = TITLES[pathname] || (pathname.startsWith('/bill/') ? 'Invoice' : 'OMSS Billing')

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-3.5 lg:px-8 no-print">
      <div className="flex items-center gap-2.5 lg:hidden">
        <ShieldLogo size={30} />
        <span className="font-display font-bold text-sm text-[#0A2E8A] dark:text-orange-400">OMSS</span>
      </div>
      <h1 className="hidden lg:block font-display text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h1>
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="rounded-full p-2.5 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {theme === 'dark' ? <FiSun size={19} /> : <FiMoon size={19} />}
      </button>
    </header>
  )
}
