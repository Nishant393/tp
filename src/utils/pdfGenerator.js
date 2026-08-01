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

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
  } else {
    // Paginate if the invoice content is taller than one A4 page
    let heightLeft = imgHeight
    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }
  }

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
