export default function Spinner({ size = 24, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-[3px] border-orange-200 border-t-orange-500 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
