import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

/**
 * Renders the given DOM element (the invoice, not the whole page) to a
 * pixel-perfect A4 PDF using html2canvas + jsPDF.
 * @param {HTMLElement} element - the invoice container to capture
 * @param {string} fileName - e.g. "Invoice_OMSS_00001.pdf"
 * @param {{ save?: boolean }} options - save=false returns the PDF instead of downloading
 * @returns {Promise<jsPDF>}
 */
export async function generateInvoicePDF(element, fileName = 'invoice.pdf', options = {}) {
  if (!element) throw new Error('Invoice element not found')

  const canvas = await html2canvas(element, {
    scale: 3, // high quality, avoids blur
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/png', 1.0)

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Fit the whole invoice onto a single page. Scale by whichever dimension
  // (width or height) is the tighter constraint, then center the result —
  // this guarantees exactly one page, never a second overflow page.
  const widthRatio = pageWidth / canvas.width
  const heightRatio = pageHeight / canvas.height
  const scale = Math.min(widthRatio, heightRatio)

  const imgWidth = canvas.width * scale
  const imgHeight = canvas.height * scale
  const offsetX = (pageWidth - imgWidth) / 2
  const offsetY = (pageHeight - imgHeight) / 2

  pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST')

  if (options.save !== false) {
    pdf.save(fileName)
  }

  return pdf
}

/** Returns the generated PDF as a File object, for Web Share API attachments. */
export async function pdfToFile(pdf, fileName) {
  const blob = pdf.output('blob')
  return new File([blob], fileName, { type: 'application/pdf' })
}

/** Opens the PDF in a new browser tab for previewing before download. */
export function previewPDFBlob(pdf) {
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
}
