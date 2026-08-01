import { useEffect, useRef } from 'react'
import { saveDraft } from '../services/storageService'

/**
 * Debounced auto-save of the current form values to localStorage as a
 * draft, so users don't lose in-progress bills on accidental navigation
 * or a closed tab.
 */
export function useAutoSaveDraft(watch, enabled = true, delay = 800) {
  const timer = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const subscription = watch((values) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => saveDraft(values), delay)
    })
    return () => {
      subscription.unsubscribe()
      clearTimeout(timer.current)
    }
  }, [watch, enabled, delay])
}
