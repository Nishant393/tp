import { forwardRef } from 'react'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import ShieldLogo from '../ui/ShieldLogo'
import { numberToWords } from '../../utils/numberToWords'

const formatCurrency = (n) =>
  `\u20B9${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Bill-book style tables look best with a fixed minimum number of numbered
// rows (like the printed OMSS receipt book), padded out with blank rows when
// there are fewer real items so the table never looks sparse.
const MIN_ROWS = 6

/**
 * The printable/exportable invoice itself — styled to match the physical
 * "Orange Multipurpose Security Service" bill / receipt book (A4 portrait),
 * captured by html2canvas-pro for PDF export and shown live as a preview.
 */
const InvoicePreview = forwardRef(function InvoicePreview({ bill, company }, ref) {
  const {
    billNumber,
    date,
    customer = {},
    items = [],
    notes,
    subtotal,
    discount,
    tax,
    grandTotal,
    discountType,
    discountValue,
    taxPercent,
  } = bill

  const qrValue = JSON.stringify({
    bill: billNumber,
    customer: customer.customerName,
    total: grandTotal,
    date,
  })

  const blankRows = Math.max(0, MIN_ROWS - items.length)

  return (
    <div
      id="invoice-print-area"
      ref={ref}
      className="mx-auto w-full max-w-[210mm] bg-[#ffffff] text-[#1e293b]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="p-6 sm:p-8">
        {/* ===== Header: logo + company name ===== */}
        <div className="flex items-start gap-4">
          <div className="flex shrink-0 flex-col items-center text-center">
            <ShieldLogo size={64} />
            <p className="mt-1 w-20 text-[9px] font-bold leading-tight text-[#0A2E8A]">
              ORANGE
              <br />
              MULTIPURPOSE
              <br />
              SECURITY SERVICE
            </p>
          </div>
          <div className="flex-1 pt-1 text-center">
            <h1 className="font-display text-2xl sm:text-[28px] font-extrabold uppercase leading-[1.1] text-[#F97316]">
              {company.name?.split(' ').slice(0, 2).join(' ') || 'Orange Multipurpose'}
            </h1>
            <h2 className="font-display text-3xl sm:text-[34px] font-extrabold uppercase leading-[1.1] text-[#0A2E8A]">
              {company.name?.split(' ').slice(2).join(' ') || 'Security Service'}
            </h2>
          </div>
          <div className="w-16 shrink-0" />
        </div>

        {/* ===== Contact strip ===== */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-b border-[#cbd5e1] py-3 text-xs text-[#334155]">
          <div className="flex items-start gap-1.5 sm:border-r sm:border-[#cbd5e1] sm:pr-2">
            <FiMapPin className="mt-0.5 shrink-0 text-[#0A2E8A]" size={13} />
            <span>
              {company.addressLine1}
              <br />
              {company.addressLine2}
            </span>
          </div>
          <div className="flex items-start gap-1.5 sm:border-r sm:border-[#cbd5e1] sm:pr-2 sm:pl-2">
            <FiPhone className="mt-0.5 shrink-0 text-[#0A2E8A]" size={13} />
            <span>
              MOBILE NO.
              <br />
              {(company.phones || []).join(' / ')}
            </span>
          </div>
          <div className="flex items-start gap-1.5 sm:pl-2">
            <FiMail className="mt-0.5 shrink-0 text-[#0A2E8A]" size={13} />
            <span>{company.email}</span>
          </div>
        </div>

        {/* ===== Bill/Receipt title ===== */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="h-px flex-1 bg-[#cbd5e1]" />
          <h3 className="font-display text-2xl font-extrabold tracking-wide text-[#0A2E8A]">BILL / RECEIPT</h3>
          <div className="h-px flex-1 bg-[#cbd5e1]" />
        </div>
        {/* ===== Bill meta: date/bill-to (left) + state/state code (right) ===== */}
        <div className="mt-3 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 space-y-2 text-sm">
            <p>
              <span className="font-semibold text-[#475569]">Date:</span>{' '}
              {date ? dayjs(date).format('DD/MM/YYYY') : '—'}
            </p>
            <div>
              <span className="font-semibold text-[#475569]">Bill To:</span>
              <p className="mt-0.5 font-semibold text-[#1e293b]">{customer.customerName || '—'}</p>
              {customer.companyName && <p className="text-[#475569]">{customer.companyName}</p>}
              {customer.address && <p className="text-[#475569] whitespace-pre-line">{customer.address}</p>}
              <p className="text-[#475569]">
                {customer.mobile}
                {customer.email ? ` · ${customer.email}` : ''}
              </p>
            </div>
            <p>
              <span className="font-semibold text-[#475569]">GSTIN:</span> {customer.gstin || '—'}
            </p>
            <p>
              <span className="font-semibold text-[#475569]">Bill No.:</span>{' '}
              <span className="font-mono font-semibold">{billNumber}</span>
            </p>
          </div>
          <div className="shrink-0 space-y-2 text-sm sm:text-right">
            <p>
              <span className="font-semibold text-[#475569]">State:</span> {customer.state || '—'}
            </p>
            <p>
              <span className="font-semibold text-[#475569]">State Code:</span> {customer.stateCode || '—'}
            </p>
          </div>
        </div>

        {/* ===== Items table ===== */}
        <table className="mt-5 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#0A2E8A] text-white">
              <th className="border border-[#0A2E8A] px-2 py-2.5 text-center font-semibold w-10">S. No.</th>
              <th className="border border-[#0A2E8A] px-3 py-2.5 text-left font-semibold">Description</th>
              <th className="border border-[#0A2E8A] px-2 py-2.5 text-center font-semibold w-16">Qty.</th>
              <th className="border border-[#0A2E8A] px-2 py-2.5 text-right font-semibold w-24">Rate</th>
              <th className="border border-[#0A2E8A] px-3 py-2.5 text-right font-semibold w-28">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id || i}>
                <td className="border border-[#cbd5e1] px-2 py-2 text-center text-[#64748b]">{i + 1}.</td>
                <td className="border border-[#cbd5e1] px-3 py-2">{item.description || '—'}</td>
                <td className="border border-[#cbd5e1] px-2 py-2 text-center">{item.quantity}</td>
                <td className="border border-[#cbd5e1] px-2 py-2 text-right">{formatCurrency(item.rate)}</td>
                <td className="border border-[#cbd5e1] px-3 py-2 text-right font-medium">
                  {formatCurrency((Number(item.quantity) || 0) * (Number(item.rate) || 0))}
                </td>
              </tr>
            ))}
            {Array.from({ length: blankRows }).map((_, i) => (
              <tr key={`blank-${i}`}>
                <td className="border border-[#cbd5e1] px-2 py-2 text-center text-[#cbd5e1]">
                  {items.length + i + 1}.
                </td>
                <td className="border border-[#cbd5e1] px-3 py-2">&nbsp;</td>
                <td className="border border-[#cbd5e1] px-2 py-2">&nbsp;</td>
                <td className="border border-[#cbd5e1] px-2 py-2">&nbsp;</td>
                <td className="border border-[#cbd5e1] px-3 py-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== Amount in words / notes (left) + totals box (right) ===== */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#475569]">Amount in Words :</p>
              <p className="mt-1 border-b border-dotted border-[#94a3b8] pb-1 text-sm italic text-[#334155]">
                {numberToWords(grandTotal)}
              </p>
            </div>
            {notes && (
              <div>
                <p className="text-xs font-semibold text-[#475569]">Notes :</p>
                <p className="mt-1 rounded border border-[#cbd5e1] px-3 py-2 text-sm text-[#475569] whitespace-pre-line">
                  {notes}
                </p>
              </div>
            )}
          </div>
          <table className="w-full sm:w-64 shrink-0 border-collapse text-sm">
            <tbody>
              <tr>
                <td className="border border-[#cbd5e1] px-3 py-1.5 font-medium text-[#475569]">SUBTOTAL</td>
                <td className="border border-[#cbd5e1] px-3 py-1.5 text-right">{formatCurrency(subtotal)}</td>
              </tr>
              <tr>
                <td className="border border-[#cbd5e1] px-3 py-1.5 font-medium text-[#475569]">
                  DISCOUNT {discountType === 'percent' && discountValue ? `(${discountValue}%)` : ''}
                </td>
                <td className="border border-[#cbd5e1] px-3 py-1.5 text-right">{formatCurrency(discount)}</td>
              </tr>
              <tr>
                <td className="border border-[#cbd5e1] px-3 py-1.5 font-medium text-[#475569]">
                  TAX {taxPercent ? `(${taxPercent}%)` : ''}
                </td>
                <td className="border border-[#cbd5e1] px-3 py-1.5 text-right">{formatCurrency(tax)}</td>
              </tr>
              <tr className="bg-[#0A2E8A] text-white">
                <td className="border border-[#0A2E8A] px-3 py-2 font-bold">TOTAL</td>
                <td className="border border-[#0A2E8A] px-3 py-2 text-right font-bold">
                  {formatCurrency(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== Bank details + signature ===== */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-6 border-t border-dashed border-[#cbd5e1] pt-5">
          <div className="text-sm">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#0A2E8A]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2 2 8v2h20V8L12 2zm-8 9v8h3v-8H4zm6.5 0v8h3v-8h-3zm7 0v8h3v-8h-3zM2 21h20v-2H2v2z" />
              </svg>{' '}
              Bank Details
            </p>
            <p className="mt-1.5 text-[#475569]">
              <span className="font-medium text-[#334155]">Bank Name :</span> {company.bank?.bankName}
            </p>
            <p className="text-[#475569]">
              <span className="font-medium text-[#334155]">Account Name :</span> {company.bank?.accountName}
            </p>
            <p className="text-[#475569]">
              <span className="font-medium text-[#334155]">Account No. :</span> {company.bank?.accountNumber}
            </p>
            <p className="text-[#475569]">
              <span className="font-medium text-[#334155]">IFSC Code :</span> {company.bank?.ifsc}
            </p>
          </div>
          <div className="text-center shrink-0 self-end">
            <p className="border-t border-[#64748b] pt-1 text-xs text-[#475569]">Authorized Signatory</p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm font-semibold tracking-wide text-[#F97316]">
          ★ ★ ★ Thank You! ★ ★ ★
        </p>
      </div>
    </div>
  )
})

export default InvoicePreview
