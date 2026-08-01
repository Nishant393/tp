/**
 * Triggers the browser print dialog. CSS in styles/index.css hides
 * everything except #invoice-print-area and enforces A4 margins.
 */
export function printInvoice() {
  window.print()
}
