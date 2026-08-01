import dayjs from 'dayjs'
import { loadBills } from '../services/storageService'

/**
 * Generates the next sequential bill number for the current year,
 * formatted as OMSS-YYYY-00001. Scans existing stored bills to find
 * the highest sequence used this year, so numbers stay unique even
 * after deletions.
 */
export function generateBillNumber() {
  const year = dayjs().format('YYYY')
  const bills = loadBills()
  const prefix = `OMSS-${year}-`

  const maxSeq = bills.reduce((max, bill) => {
    if (bill.billNumber && bill.billNumber.startsWith(prefix)) {
      const seq = parseInt(bill.billNumber.slice(prefix.length), 10)
      if (!Number.isNaN(seq) && seq > max) return seq
    }
    return max
  }, 0)

  const next = String(maxSeq + 1).padStart(5, '0')
  return `${prefix}${next}`
}
