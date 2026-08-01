/**
 * LocalStorage-backed persistence for bills, settings, and drafts.
 * Centralizing keys/access here keeps components free of raw
 * localStorage calls and makes the storage schema easy to evolve.
 */
const KEYS = {
  BILLS: 'omss_bills',
  SETTINGS: 'omss_settings',
  DRAFT: 'omss_draft',
  THEME: 'omss_theme',
}

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function loadBills() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(KEYS.BILLS), [])
}

export function saveBills(bills) {
  localStorage.setItem(KEYS.BILLS, JSON.stringify(bills))
}

export function saveBill(bill) {
  const bills = loadBills()
  const idx = bills.findIndex((b) => b.id === bill.id)
  if (idx >= 0) {
    bills[idx] = bill
  } else {
    bills.unshift(bill)
  }
  saveBills(bills)
  return bill
}

export function deleteBill(id) {
  const bills = loadBills().filter((b) => b.id !== id)
  saveBills(bills)
  return bills
}

export function getBillById(id) {
  return loadBills().find((b) => b.id === id) || null
}

export function loadSettings(defaults) {
  const stored = safeParse(localStorage.getItem(KEYS.SETTINGS), null)
  return stored ? { ...defaults, ...stored } : defaults
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
}

export function loadDraft() {
  return safeParse(localStorage.getItem(KEYS.DRAFT), null)
}

export function saveDraft(draft) {
  localStorage.setItem(KEYS.DRAFT, JSON.stringify(draft))
}

export function clearDraft() {
  localStorage.removeItem(KEYS.DRAFT)
}

export function loadTheme() {
  return localStorage.getItem(KEYS.THEME) || 'light'
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme)
}
