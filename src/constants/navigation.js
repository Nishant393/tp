import { FiHome, FiFilePlus, FiClock, FiSettings } from 'react-icons/fi'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/new-bill', label: 'New Bill', icon: FiFilePlus },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]
