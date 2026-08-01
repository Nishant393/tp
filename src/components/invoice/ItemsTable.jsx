import { FiPlus, FiTrash2, FiCopy } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { uid } from '../../utils/id'

const formatCurrency = (n) =>
  `\u20B9${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/**
 * Dynamic, editable bill-items table. Backed by react-hook-form's
 * useFieldArray (passed in as `fields`/`append`/`remove`/`insert`),
 * with amount computed live from quantity × rate.
 */
export default function ItemsTable({ fields, append, remove, insert, register, watch, errors }) {
  const items = watch('items')

  const addItem = () =>
    append({ id: uid('item_'), description: '', quantity: 1, rate: 0 })

  const duplicateItem = (index) => {
    const item = items[index]
    insert(index + 1, { ...item, id: uid('item_') })
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-[#0A2E8A] text-white text-left text-xs uppercase tracking-wide">
              <th className="px-3 py-3 font-semibold">Description</th>
              <th className="px-3 py-3 font-semibold w-24">Qty</th>
              <th className="px-3 py-3 font-semibold w-32">Rate (₹)</th>
              <th className="px-3 py-3 font-semibold w-32 text-right">Amount</th>
              <th className="px-3 py-3 font-semibold w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            <AnimatePresence initial={false}>
              {fields.map((field, index) => {
                const qty = Number(items?.[index]?.quantity) || 0
                const rate = Number(items?.[index]?.rate) || 0
                const amount = qty * rate
                return (
                  <motion.tr
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-slate-800"
                  >
                    <td className="px-3 py-2 align-top">
                      <input
                        {...register(`items.${index}.description`, { required: true })}
                        placeholder="Service description"
                        aria-label={`Item ${index + 1} description`}
                        className={`w-full rounded-lg border px-2.5 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20
                          ${errors?.items?.[index]?.description ? 'border-red-400' : 'border-slate-200 dark:border-slate-600 focus:border-orange-500'}`}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        {...register(`items.${index}.quantity`, { required: true, min: 0.01, valueAsNumber: true })}
                        aria-label={`Item ${index + 1} quantity`}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register(`items.${index}.rate`, { required: true, min: 0.01, valueAsNumber: true })}
                        aria-label={`Item ${index + 1} rate`}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </td>
                    <td className="px-3 py-2 align-top text-right font-semibold text-slate-800 dark:text-slate-100">
                      {formatCurrency(amount)}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => duplicateItem(index)}
                          aria-label={`Duplicate item ${index + 1}`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-orange-500"
                        >
                          <FiCopy size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => fields.length > 1 && remove(index)}
                          disabled={fields.length <= 1}
                          aria-label={`Delete item ${index + 1}`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addItem}
        className="btn-ripple mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-500/40 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
      >
        <FiPlus size={16} /> Add Item
      </button>
    </div>
  )
}
