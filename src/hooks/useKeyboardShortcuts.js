import { useEffect } from 'react'

/**
 * Registers Ctrl/Cmd+S (save draft) and Ctrl/Cmd+P (print/generate) shortcuts.
 * @param {{ onSave?: () => void, onPrint?: () => void }} handlers
 */
export function useKeyboardShortcuts({ onSave, onPrint }) {
  useEffect(() => {
    const handler = (e) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      if (e.key.toLowerCase() === 's' && onSave) {
        e.preventDefault()
        onSave()
      }
      if (e.key.toLowerCase() === 'p' && onPrint) {
        e.preventDefault()
        onPrint()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSave, onPrint])
}
