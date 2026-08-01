import Input from '../ui/Input'
import Select from '../ui/Select'
import { numberToWords } from '../../utils/numberToWords'

const formatCurrency = (n) =>
  `\u20B9${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Editable summary panel: discount/tax inputs plus computed totals and amount-in-words. */
export default function SummaryCard({ register, totals }) {
  const { subtotal, discount, tax, grandTotal } = totals

  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Discount Type" {...register('discountType')}>
          <option value="flat">Flat (₹)</option>
          <option value="percent">Percent (%)</option>
        </Select>
        <Input
          label="Discount Value"
          type="number"
          min="0"
          step="0.01"
          {...register('discountValue', { valueAsNumber: true })}
        />
      </div>
      <Input label="Tax %" type="number" min="0" step="0.01" {...register('taxPercent', { valueAsNumber: true })} />

      <div className="space-y-1.5 border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Discount</span>
          <span className="font-medium text-red-500">- {formatCurrency(discount)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Tax</span>
          <span className="font-medium">+ {formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-base font-bold text-slate-800 dark:text-slate-100">
          <span>Grand Total</span>
          <span className="text-orange-600 dark:text-orange-400">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <p className="rounded-lg bg-orange-50 dark:bg-orange-500/10 px-3 py-2 text-xs italic text-slate-600 dark:text-slate-300">
        {numberToWords(grandTotal)}
      </p>
    </div>
  )
}
