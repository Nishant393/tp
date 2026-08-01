import { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_COMPANY } from '../constants/company'
import * as storage from '../services/storageService'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => storage.loadSettings(DEFAULT_COMPANY))

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      storage.saveSettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    storage.saveSettings(DEFAULT_COMPANY)
    setSettings(DEFAULT_COMPANY)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
