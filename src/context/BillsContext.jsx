import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import * as storage from '../services/storageService'

const BillsContext = createContext(null)

export function BillsProvider({ children }) {
  const [bills, setBills] = useState(() => storage.loadBills())

  const addOrUpdateBill = useCallback((bill) => {
    const saved = storage.saveBill(bill)
    setBills(storage.loadBills())
    return saved
  }, [])

  const removeBill = useCallback((id) => {
    const updated = storage.deleteBill(id)
    setBills(updated)
  }, [])

  const getBill = useCallback((id) => storage.getBillById(id), [])

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todaysBills = bills.filter((b) => new Date(b.date).toDateString() === today)
    const totalRevenue = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0)
    return {
      totalBills: bills.length,
      todaysBills: todaysBills.length,
      totalRevenue,
      recentBills: bills.slice(0, 5),
    }
  }, [bills])

  const value = { bills, addOrUpdateBill, removeBill, getBill, stats }

  return <BillsContext.Provider value={value}>{children}</BillsContext.Provider>
}

export function useBills() {
  const ctx = useContext(BillsContext)
  if (!ctx) throw new Error('useBills must be used within BillsProvider')
  return ctx
}
