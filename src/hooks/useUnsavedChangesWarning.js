import { useEffect } from 'react'

/** Warns the user before they close/refresh the tab with unsaved form changes. */
export function useUnsavedChangesWarning(isDirty) {
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])
}
