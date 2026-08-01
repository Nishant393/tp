import { motion } from 'framer-motion'

/** Reusable elevated card with hover lift, used across dashboard/history/settings. */
export default function Card({ children, className = '', hover = true, as: As = motion.div, ...rest }) {
  return (
    <As
      whileHover={hover ? { y: -3, boxShadow: '0 12px 24px -8px rgba(15,23,42,0.12)' } : undefined}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </As>
  )
}
