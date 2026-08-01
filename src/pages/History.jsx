import { useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSearch, FiInbox } from 'react-icons/fi'
import { useBills } from '../context/BillsContext'
import { useSettings } from '../context/SettingsContext'
import { generateInvoicePDF } from '../utils/pdfGenerator'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import BillRow from '../components/history/BillRow'
import InvoicePreview from '../components/invoice/InvoicePreview'

const PAGE_SIZE = 8

export default function History() {
  const { bills, removeBill } = useBills()
  const { settings } = useSettings()
  const [query, setQuery] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState(null)
  const [downloadBill, setDownloadBill] = useState(null)
  const downloadRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return bills
    return bills.filter((b) => {
      const name = (b.customer?.customerName || b.customerName || '').toLowerCase()
      const mobile = (b.customer?.mobile || '').toLowerCase()
      const num = (b.billNumber || '').toLowerCase()
      const date = (b.date || '').toLowerCase()
      if (filterBy === 'billNumber') return num.includes(q)
      if (filterBy === 'customer') return name.includes(q)
      if (filterBy === 'mobile') return mobile.includes(q)
      if (filterBy === 'date') return date.includes(q)
      return num.includes(q) || name.includes(q) || mobile.includes(q) || date.includes(q)
    })
  }, [bills, query, filterBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const confirmDelete = () => {
    removeBill(toDelete.id)
    toast.success('Bill deleted')
    setToDelete(null)
  }

  const handleDownload = async (bill) => {
    setDownloadBill(bill)
    // wait a tick for the off-screen invoice to render with new bill data
    setTimeout(async () => {
      try {
        await generateInvoicePDF(downloadRef.current, `Invoice_OMSS_${bill.billNumber?.split('-').pop() || '00001'}.pdf`)
        toast.success('PDF downloaded')
      } catch {
        toast.error('Could not generate PDF')
      }
    }, 150)
  }

  return (
    <div>
      <div className="mb-5 lg:hidden">
        <h1 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">Bill History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{bills.length} bills generated</p>
      </div>

      <Card className="p-4 mb-5" hover={false}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search bills..."
              aria-label="Search bills"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="sm:w-48"
            aria-label="Filter by field"
          >
            <option value="all">All Fields</option>
            <option value="billNumber">Bill Number</option>
            <option value="customer">Customer Name</option>
            <option value="mobile">Mobile</option>
            <option value="date">Date</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden" hover={false}>
        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <FiInbox size={36} className="text-slate-300" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No bills match your search.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3 font-semibold">Bill No.</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold text-right">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((bill) => (
                    <BillRow key={bill.id} bill={bill} onDelete={setToDelete} onDownload={handleDownload} />
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 px-4 py-3">
                <p className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </Button>
                  <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Off-screen invoice for "Download Again" */}
      {downloadBill && (
        <div className="fixed -left-[9999px] top-0" aria-hidden="true">
          <InvoicePreview bill={downloadBill} company={settings} ref={downloadRef} />
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete this bill?"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete bill <span className="font-mono font-medium">{toDelete?.billNumber}</span>. This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
