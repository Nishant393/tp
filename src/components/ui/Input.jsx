import { forwardRef } from 'react'

/** Reusable labeled text input with error message support (for React Hook Form). */
const Input = forwardRef(function Input(
  { label, error, hint, className = '', required, ...rest },
  ref
) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-orange-500">*</span>}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 transition-colors
          ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-orange-500'}
          focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-100' : 'focus:ring-orange-100 dark:focus:ring-orange-500/20'}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      {!error && hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
})

export default Input
