import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFileText, FiCalendar, FiDollarSign, FiPlus, FiEye, FiInbox } from 'react-icons/fi'
import dayjs from 'dayjs'
import { useBills } from '../context/BillsContext'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Button from '../components/ui/Button'

const formatCurrency = (n) =>
  `\u20B9${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function Dashboard() {
  const { stats } = useBills()
  const navigate = useNavigate()

  return (
    <div className="relative">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="mb-6 lg:hidden">
          <h1 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your billing activity</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard icon={FiFileText} label="Total Bills" value={stats.totalBills} accent="navy" />
          <StatCard icon={FiCalendar} label="Today's Bills" value={stats.todaysBills} accent="orange" />
          <StatCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            accent="green"
          />
        </div>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-slate-800 dark:text-slate-100">Recent Bills</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
            >
              View all
            </button>
          </div>

          {stats.recentBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <FiInbox size={36} className="text-slate-300" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No bills yet. Create your first invoice.</p>
              <Button className="mt-2" icon={FiPlus} onClick={() => navigate('/new-bill')}>
                New Bill
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {stats.recentBills.map((bill) => (
                <li key={bill.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm text-slate-800 dark:text-slate-100">
                      {bill.customerName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {bill.billNumber} · {dayjs(bill.date).format('DD MMM YYYY')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                      {formatCurrency(bill.grandTotal)}
                    </span>
                    <button
                      onClick={() => navigate(`/bill/${bill.id}`)}
                      aria-label={`View bill ${bill.billNumber}`}
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <FiEye size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </motion.div>

      {/* Floating New Bill button */}
      <motion.button
        onClick={() => navigate('/new-bill')}
        whileTap={{ scale: 0.92 }}
        aria-label="Create new bill"
        className="btn-ripple fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 text-white shadow-xl shadow-orange-500/40 no-print"
      >
        <FiPlus size={22} />
        <span className="hidden sm:inline font-semibold text-sm">New Bill</span>
      </motion.button>
    </div>
  )
}
