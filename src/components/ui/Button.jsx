import { forwardRef } from 'react'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/30',
  secondary:
    'bg-[#0A2E8A] text-white hover:bg-[#082563] shadow-md shadow-blue-900/20',
  outline:
    'border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10',
  ghost:
    'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

/** Reusable button with ripple micro-interaction and variant/size tokens. */
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, icon: Icon, loading, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`btn-ripple inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        Icon && <Icon className="shrink-0" size={18} />
      )}
      {children}
    </button>
  )
})

export default Button
