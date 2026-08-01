/**
 * Pure calculation helpers for bill totals.
 * All functions are side-effect free and rounded to 2 decimal places.
 */
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

export function calculateItemAmount(item) {
  const qty = Number(item.quantity) || 0
  const rate = Number(item.rate) || 0
  return round2(qty * rate)
}

export function calculateSubtotal(items = []) {
  return round2(items.reduce((sum, item) => sum + calculateItemAmount(item), 0))
}

export function calculateDiscount(subtotal, discountValue = 0, discountType = 'flat') {
  const value = Number(discountValue) || 0
  if (discountType === 'percent') {
    return round2((subtotal * value) / 100)
  }
  return round2(value)
}

export function calculateTax(taxableAmount, taxPercent = 0) {
  const percent = Number(taxPercent) || 0
  return round2((taxableAmount * percent) / 100)
}

export function calculateGrandTotal({ items = [], discountValue = 0, discountType = 'flat', taxPercent = 0 }) {
  const subtotal = calculateSubtotal(items)
  const discount = calculateDiscount(subtotal, discountValue, discountType)
  const taxable = Math.max(subtotal - discount, 0)
  const tax = calculateTax(taxable, taxPercent)
  const grandTotal = round2(taxable + tax)
  return { subtotal, discount, tax, grandTotal }
}
