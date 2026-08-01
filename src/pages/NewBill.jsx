import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { FiEye, FiSave, FiPrinter, FiShare2, FiRotateCcw } from 'react-icons/fi'

import { useBills } from '../context/BillsContext'
import { useSettings } from '../context/SettingsContext'
import { generateBillNumber } from '../utils/generateBillNumber'
import { calculateGrandTotal } from '../utils/calculations'
import { uid } from '../utils/id'
import { loadDraft, clearDraft } from '../services/storageService'
import { useAutoSaveDraft } from '../hooks/useAutoSaveDraft'
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import CustomerFields from '../components/invoice/CustomerFields'
import ItemsTable from '../components/invoice/ItemsTable'
import SummaryCard from '../components/invoice/SummaryCard'
import InvoicePreview from '../components/invoice/InvoicePreview'
import ShareDialog from '../components/invoice/ShareDialog'

function buildDefaultValues() {
  return {
    billNumber: generateBillNumber(),
    date: dayjs().format('YYYY-MM-DD'),
    customerName: '',
    companyName: '',
    gstin: '',
    state: '',
    stateCode: '',
    mobile: '',
    email: '',
    address: '',
    notes: '',
    items: [{ id: uid('item_'), description: '', quantity: 1, rate: 0 }],
    discountType: 'flat',
    discountValue: 0,
    taxPercent: 0,
  }
}

export default function NewBill() {
  const { id } = useParams() // present when editing an existing bill
  const { addOrUpdateBill, getBill } = useBills()
  const { settings } = useSettings()

  const isEditMode = !!id
  const existingBill = isEditMode ? getBill(id) : null

  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [draftPrompted, setDraftPrompted] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const invoiceRef = useRef(null)
  const mobilePreviewRef = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: existingBill
      ? {
          billNumber: existingBill.billNumber,
          date: dayjs(existingBill.date).format('YYYY-MM-DD'),
          ...existingBill.customer,
          notes: existingBill.notes,
          items: existingBill.items,
          discountType: existingBill.discountType,
          discountValue: existingBill.discountValue,
          taxPercent: existingBill.taxPercent,
        }
      : buildDefaultValues(),
  })

  const { fields, append, remove, insert } = useFieldArray({ control, name: 'items' })
  const values = watch()

  // Offer to restore an autosaved draft only for brand-new bills
  useEffect(() => {
    if (!isEditMode && !draftPrompted) {
      const draft = loadDraft()
      if (draft && draft.customerName) {
        setShowDraftModal(true)
      }
      setDraftPrompted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode])

  useAutoSaveDraft(watch, !isEditMode)
  useUnsavedChangesWarning(isDirty)

  const totals = useMemo(
    () =>
      calculateGrandTotal({
        items: values.items || [],
        discountValue: values.discountValue,
        discountType: values.discountType,
        taxPercent: values.taxPercent,
      }),
    [values.items, values.discountValue, values.discountType, values.taxPercent]
  )

  const currentBill = {
    id: existingBill?.id || uid('bill_'),
    billNumber: values.billNumber,
    date: values.date,
    customer: {
      customerName: values.customerName,
      companyName: values.companyName,
      gstin: values.gstin,
      state: values.state,
      stateCode: values.stateCode,
      mobile: values.mobile,
      email: values.email,
      address: values.address,
    },
    customerName: values.customerName,
    notes: values.notes,
    items: values.items,
    discountType: values.discountType,
    discountValue: values.discountValue,
    taxPercent: values.taxPercent,
    ...totals,
    createdAt: existingBill?.createdAt || new Date().toISOString(),
  }

  const persistBill = () => {
    addOrUpdateBill(currentBill)
    clearDraft()
    return currentBill
  }

  const onSubmit = () => {
    persistBill()
    toast.success(isEditMode ? 'Bill updated' : 'Bill saved')
    setShowShareDialog(true)
  }

  const onSaveDraftShortcut = () => {
    persistBill()
    toast.success('Draft saved')
  }

  useKeyboardShortcuts({
    onSave: onSaveDraftShortcut,
    onPrint: () => {
      persistBill()
      setTimeout(() => window.print(), 150)
    },
  })

  const restoreDraft = () => {
    const draft = loadDraft()
    if (draft) reset(draft)
    setShowDraftModal(false)
    toast.success('Draft restored')
  }

  const discardDraft = () => {
    clearDraft()
    setShowDraftModal(false)
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="lg:hidden font-display text-xl font-bold text-slate-800 dark:text-slate-100">
            {isEditMode ? 'Edit Bill' : 'New Bill'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {settings.name} · Fill in the details below to generate an invoice
          </p>
        </div>
        <Button variant="outline" size="sm" icon={FiEye} className="lg:hidden" onClick={() => setShowPreviewModal(true)}>
          Preview
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form column */}
        <div className="space-y-5">
          <Card className="p-5" hover={false}>
            <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-slate-100">Bill Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Bill Number" readOnly {...register('billNumber')} className="font-mono" />
              <Input label="Date" type="date" {...register('date', { required: true })} />
            </div>
          </Card>

          <Card className="p-5" hover={false}>
            <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-slate-100">Customer Details</h2>
            <CustomerFields register={register} errors={errors} />
          </Card>

          <Card className="p-5" hover={false}>
            <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-slate-100">Bill Items</h2>
            <ItemsTable
              fields={fields}
              append={append}
              remove={remove}
              insert={insert}
              register={register}
              watch={watch}
              errors={errors}
            />
          </Card>

          <Card className="p-5" hover={false}>
            <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-slate-100">Summary</h2>
            <SummaryCard register={register} totals={totals} />
          </Card>

          <div className="flex flex-wrap gap-3 pb-4">
            <Button type="submit" icon={FiSave} loading={isSubmitting}>
              {isEditMode ? 'Update & Share' : 'Save & Share'}
            </Button>
            <Button
              type="button"
              variant="outline"
              icon={FiPrinter}
              onClick={() => {
                persistBill()
                setTimeout(() => window.print(), 150)
              }}
            >
              Print
            </Button>
            <Button
              type="button"
              variant="secondary"
              icon={FiShare2}
              onClick={() => {
                persistBill()
                setShowShareDialog(true)
              }}
            >
              Share
            </Button>
          </div>
        </div>

        {/* Live preview column - desktop only */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <FiEye size={14} /> Live Preview
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900">
              <div className="scale-[0.72] origin-top -mb-[28%]">
                <InvoicePreview bill={currentBill} company={settings} />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Hidden full-size invoice used for PDF/print capture (kept off-screen but rendered) */}
      <div className="fixed -left-[9999px] top-0" aria-hidden="true">
        <InvoicePreview bill={currentBill} company={settings} ref={invoiceRef} />
      </div>

      {/* Mobile preview modal */}
      <Modal open={showPreviewModal} onClose={() => setShowPreviewModal(false)} title="Invoice Preview">
        <div className="scale-[0.85] origin-top">
          <InvoicePreview bill={currentBill} company={settings} ref={mobilePreviewRef} />
        </div>
      </Modal>

      {/* Draft restore prompt */}
      <Modal
        open={showDraftModal}
        onClose={discardDraft}
        title="Restore draft?"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={discardDraft}>
              Discard
            </Button>
            <Button size="sm" icon={FiRotateCcw} onClick={restoreDraft}>
              Restore
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We found an unsaved bill draft from your last session. Would you like to restore it?
        </p>
      </Modal>

      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        invoiceRef={invoiceRef}
        fileName={`Invoice_OMSS_${values.billNumber?.split('-').pop() || '00001'}.pdf`}
        customerName={values.customerName}
        customerEmail={values.email}
      />
    </div>
  )
}
