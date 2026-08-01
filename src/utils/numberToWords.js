/**
 * Converts a numeric rupee amount into English words, Indian numbering
 * system (Lakh/Crore), formatted for invoices.
 * e.g. 1520 -> "One Thousand Five Hundred Twenty Rupees Only"
 */
const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
]
const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
]

function twoDigits(n) {
  if (n < 20) return ONES[n]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return `${TENS[tens]}${ones ? ' ' + ONES[ones] : ''}`
}

function threeDigits(n) {
  const hundred = Math.floor(n / 100)
  const rest = n % 100
  let out = ''
  if (hundred) out += `${ONES[hundred]} Hundred${rest ? ' ' : ''}`
  if (rest) out += twoDigits(rest)
  return out.trim()
}

export function numberToWords(amount) {
  const value = Math.round(Math.abs(Number(amount) || 0))
  if (value === 0) return 'Zero Rupees Only'

  const paise = Math.round((Math.abs(Number(amount) || 0) - Math.floor(Math.abs(Number(amount) || 0))) * 100)

  let n = value
  const crore = Math.floor(n / 10000000)
  n %= 10000000
  const lakh = Math.floor(n / 100000)
  n %= 100000
  const thousand = Math.floor(n / 1000)
  n %= 1000
  const hundred = n

  const parts = []
  if (crore) parts.push(`${threeDigits(crore)} Crore`)
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`)
  if (hundred) parts.push(threeDigits(hundred))

  let words = parts.join(' ') + ' Rupees'
  if (paise > 0) {
    words += ` and ${twoDigits(paise)} Paise`
  }
  return `${words} Only`
}
