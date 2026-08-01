import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { FiEye, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi'

const formatCurrency = (n) =>
  `\u20B9${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Single row in the bill history table (desktop) / card (mobile). */
export default function BillRow({ bill, onDelete, onDownload }) {
  const navigate = useNavigate()

  return (
    <tr className="border-b border-slate-100 dark:border-slate-700 last:border-0">
      <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{bill.billNumber}</td>
      <td className="px-4 py-3">
        <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{bill.customer?.customerName || bill.customerName}</p>
        <p className="text-xs text-slate-400">{bill.customer?.mobile}</p>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{dayjs(bill.date).format('DD MMM YYYY')}</td>
      <td className="px-4 py-3 text-right font-semibold text-sm text-slate-800 dark:text-slate-100">
        {formatCurrency(bill.grandTotal)}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Generated
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => navigate(`/bill/${bill.id}`)} aria-label="View bill" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-orange-500">
            <FiEye size={16} />
          </button>
          <button onClick={() => navigate(`/edit-bill/${bill.id}`)} aria-label="Edit bill" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-orange-500">
            <FiEdit2 size={16} />
          </button>
          <button onClick={() => onDownload(bill)} aria-label="Download bill again" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-orange-500">
            <FiDownload size={16} />
          </button>
          <button onClick={() => onDelete(bill)} aria-label="Delete bill" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500">
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}
