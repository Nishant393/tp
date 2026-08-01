import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiEdit2, FiShare2, FiArrowLeft } from 'react-icons/fi'
import { useBills } from '../context/BillsContext'
import { useSettings } from '../context/SettingsContext'
import Button from '../components/ui/Button'
import InvoicePreview from '../components/invoice/InvoicePreview'
import ShareDialog from '../components/invoice/ShareDialog'

/** Read-only invoice view, reached from Dashboard or History "View" action. */
export default function BillView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBill } = useBills()
  const { settings } = useSettings()
  const [showShare, setShowShare] = useState(false)
  const invoiceRef = useRef(null)

  const bill = getBill(id)

  if (!bill) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-slate-500">Bill not found.</p>
        <Button onClick={() => navigate('/history')}>Back to History</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-orange-500"
        >
          <FiArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={FiEdit2} onClick={() => navigate(`/edit-bill/${bill.id}`)}>
            Edit
          </Button>
          <Button size="sm" icon={FiShare2} onClick={() => setShowShare(true)}>
            Share
          </Button>
        </div>
      </div>

      <InvoicePreview bill={bill} company={settings} ref={invoiceRef} />

      <ShareDialog
        open={showShare}
        onClose={() => setShowShare(false)}
        invoiceRef={invoiceRef}
        fileName={`Invoice_OMSS_${bill.billNumber?.split('-').pop() || '00001'}.pdf`}
        customerName={bill.customer?.customerName}
        customerEmail={bill.customer?.email}
      />
    </div>
  )
}
