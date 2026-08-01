import { forwardRef } from 'react'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import ShieldLogo from '../ui/ShieldLogo'
import { numberToWords } from '../../utils/numberToWords'

const formatCurrency = (n) =>
  `Rs. ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/**
 * The printable/exportable invoice itself — styled like a traditional
 * printed receipt book (A4 portrait), captured by html2canvas for PDF
 * export and shown live in the New Bill page as a preview.
 */
const InvoicePreview = forwardRef(function InvoicePreview({ bill, company }, ref) {
  const { billNumber, date, customer = {}, items = [], notes, subtotal, discount, tax, grandTotal, discountType, discountValue, taxPercent } = bill

  const qrValue = JSON.stringify({
    bill: billNumber,
    customer: customer.customerName,
    total: grandTotal,
    date,
  })

  return (
    <div
      id="invoice-print-area"
      ref={ref}
      className="mx-auto w-full max-w-[210mm] bg-white text-slate-800 shadow-lg print:shadow-none"
      style={{ minHeight: '297mm', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b-4 border-[#0A2E8A] pb-5">
          <div className="flex items-start gap-3">
            <ShieldLogo size={56} />
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-[#F97316]">
                {company.name}
              </h1>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {company.addressLine1}
                <br />
                {company.addressLine2}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {(company.phones || []).join(' / ')} &nbsp;·&nbsp; {company.email}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-lg font-bold text-[#0A2E8A]">INVOICE</p>
            <p className="mt-1 text-xs text-slate-500">Bill No.</p>
            <p className="font-mono text-sm font-semibold text-slate-800">{billNumber}</p>
            <p className="mt-1 text-xs text-slate-500">Date</p>
            <p className="text-sm font-semibold text-slate-800">{dayjs(date).format('DD MMM YYYY')}</p>
          </div>
        </div>

        {/* Customer + QR */}
        <div className="mt-5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A2E8A]">Bill To</p>
            <p className="mt-1 font-semibold text-slate-800">{customer.customerName || '—'}</p>
            {customer.companyName && <p className="text-sm text-slate-600">{customer.companyName}</p>}
            {customer.address && <p className="text-sm text-slate-600 whitespace-pre-line">{customer.address}</p>}
            <p className="mt-1 text-sm text-slate-600">
              {customer.mobile}
              {customer.email ? ` · ${customer.email}` : ''}
            </p>
            {(customer.gstin || customer.state) && (
              <p className="mt-1 text-xs text-slate-500">
                {customer.gstin && `GSTIN: ${customer.gstin}`}
                {customer.state && `  ·  State: ${customer.state}${customer.stateCode ? ` (${customer.stateCode})` : ''}`}
              </p>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <QRCodeSVG value={qrValue} size={76} fgColor="#0A2E8A" />
            <p className="mt-1 text-[10px] text-slate-400">Scan to verify</p>
          </div>
        </div>

        {/* Items table */}
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#0A2E8A] text-white">
              <th className="px-3 py-2.5 text-left font-semibold rounded-l-md">#</th>
              <th className="px-3 py-2.5 text-left font-semibold">Description</th>
              <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
              <th className="px-3 py-2.5 text-right font-semibold">Rate</th>
              <th className="px-3 py-2.5 text-right font-semibold rounded-r-md">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id || i} className={i % 2 === 0 ? 'bg-orange-50/40' : 'bg-white'}>
                <td className="px-3 py-2 border-b border-slate-100 text-slate-500">{i + 1}</td>
                <td className="px-3 py-2 border-b border-slate-100">{item.description || '—'}</td>
                <td className="px-3 py-2 border-b border-slate-100 text-right">{item.quantity}</td>
                <td className="px-3 py-2 border-b border-slate-100 text-right">{formatCurrency(item.rate)}</td>
                <td className="px-3 py-2 border-b border-slate-100 text-right font-medium">
                  {formatCurrency((Number(item.quantity) || 0) * (Number(item.rate) || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-5 flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex-1">
            {notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0A2E8A]">Notes</p>
                <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">{notes}</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0A2E8A]">Amount in Words</p>
              <p className="mt-1 text-sm italic text-slate-700">{numberToWords(grandTotal)}</p>
            </div>
          </div>
          <div className="w-full sm:w-64 shrink-0 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount {discountType === 'percent' ? `(${discountValue || 0}%)` : ''}</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax {taxPercent ? `(${taxPercent}%)` : ''}</span>
              <span>+ {formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#0A2E8A] pt-2 text-base font-bold text-[#0A2E8A]">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Bank details + signature */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-6 border-t border-dashed border-slate-300 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A2E8A]">Bank Details</p>
            <p className="mt-1 text-sm text-slate-600">Bank: {company.bank?.bankName}</p>
            <p className="text-sm text-slate-600">A/C Name: {company.bank?.accountName}</p>
            <p className="text-sm text-slate-600">A/C No: {company.bank?.accountNumber}</p>
            <p className="text-sm text-slate-600">IFSC: {company.bank?.ifsc}</p>
          </div>
          <div className="text-center shrink-0">
            <div className="flex h-16 w-40 items-center justify-center rounded border border-dashed border-slate-300 text-[11px] text-slate-400">
              Company Stamp
            </div>
            <p className="mt-8 border-t border-slate-400 pt-1 text-xs text-slate-500">Authorized Signatory</p>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-slate-400">
          This is a computer-generated invoice from {company.name}. Thank you for your business.
        </p>
      </div>
    </div>
  )
})

export default InvoicePreview
