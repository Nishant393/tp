import { forwardRef } from 'react'

const TextArea = forwardRef(function TextArea({ label, error, className = '', rows = 3, ...rest }, ref) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full rounded-lg border bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 transition-colors resize-none
          ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-orange-500'}
          focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-100' : 'focus:ring-orange-100 dark:focus:ring-orange-500/20'}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
})

export default TextArea
