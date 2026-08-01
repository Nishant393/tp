import { generateInvoicePDF, pdfToFile } from './pdfGenerator'

/**
 * Shares (or downloads as fallback) the invoice PDF via WhatsApp.
 * Uses the Web Share API with files when supported (mobile Chrome/Android),
 * otherwise opens wa.me with a prefilled message and downloads the PDF
 * so the user can attach it manually.
 */
export async function shareOnWhatsApp(element, fileName, customerName = 'Customer') {
  const message = `Thank you for choosing Orange Multipurpose Security Service. Please find your bill attached.`

  const pdf = await generateInvoicePDF(element, fileName, { save: false })
  const file = await pdfToFile(pdf, fileName)

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Invoice for ${customerName}`,
        text: message,
      })
      return { method: 'web-share' }
    } catch (err) {
      if (err?.name === 'AbortError') return { method: 'cancelled' }
      // fall through to wa.me fallback below
    }
  }

  // Fallback: download the PDF, then open WhatsApp with the message prefilled
  pdf.save(fileName)
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank', 'noopener,noreferrer')
  return { method: 'fallback-download' }
}

/**
 * Shares (or emails) the invoice PDF.
 * Uses Web Share API with files when supported; otherwise downloads the
 * PDF and opens the default mail client with subject/body prefilled.
 */
export async function shareByEmail(element, fileName, options = {}) {
  const subject = 'Invoice from Orange Multipurpose Security Service'
  const body = `Dear Customer,\n\nPlease find your invoice attached.\n\nThank you.\nOrange Multipurpose Security Service`

  const pdf = await generateInvoicePDF(element, fileName, { save: false })
  const file = await pdfToFile(pdf, fileName)

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: subject, text: body })
      return { method: 'web-share' }
    } catch (err) {
      if (err?.name === 'AbortError') return { method: 'cancelled' }
    }
  }

  pdf.save(fileName)
  const to = options.email || ''
  const mailUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailUrl
  return { method: 'fallback-download' }
}
