import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiDownload, FiPrinter, FiEye, FiMessageCircle, FiMail } from 'react-icons/fi'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { generateInvoicePDF, previewPDFBlob } from '../../utils/pdfGenerator'
import { shareOnWhatsApp, shareByEmail } from '../../utils/shareUtils'
import { printInvoice } from '../../utils/printInvoice'

/** Modal offering Download / Preview / Print / WhatsApp / Email actions for the generated invoice PDF. */
export default function ShareDialog({ open, onClose, invoiceRef, fileName, customerName, customerEmail }) {
  const [busy, setBusy] = useState('')

  const run = async (key, action) => {
    setBusy(key)
    try {
      await action()
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setBusy('')
    }
  }

  const handleDownload = () =>
    run('download', async () => {
      await generateInvoicePDF(invoiceRef.current, fileName)
      toast.success('PDF downloaded')
    })

  const handlePreview = () =>
    run('preview', async () => {
      const pdf = await generateInvoicePDF(invoiceRef.current, fileName, { save: false })
      previewPDFBlob(pdf)
    })

  const handlePrint = () =>
    run('print', async () => {
      onClose()
      setTimeout(() => printInvoice(), 200)
    })

  const handleWhatsApp = () =>
    run('whatsapp', async () => {
      const result = await shareOnWhatsApp(invoiceRef.current, fileName, customerName)
      if (result.method === 'fallback-download') {
        toast('PDF downloaded — attach it in WhatsApp', { icon: '📎' })
      } else if (result.method === 'web-share') {
        toast.success('Shared via WhatsApp')
      }
    })

  const handleEmail = () =>
    run('email', async () => {
      const result = await shareByEmail(invoiceRef.current, fileName, { email: customerEmail })
      if (result.method === 'fallback-download') {
        toast('PDF downloaded — attach it in your email', { icon: '📎' })
      } else if (result.method === 'web-share') {
        toast.success('Shared via Email')
      }
    })

  return (
    <Modal open={open} onClose={onClose} title="Share Invoice">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" icon={FiDownload} loading={busy === 'download'} onClick={handleDownload}>
          Download
        </Button>
        <Button variant="outline" icon={FiEye} loading={busy === 'preview'} onClick={handlePreview}>
          Preview
        </Button>
        <Button variant="outline" icon={FiPrinter} loading={busy === 'print'} onClick={handlePrint}>
          Print
        </Button>
        <Button
          className="!bg-emerald-500 hover:!bg-emerald-600"
          icon={FiMessageCircle}
          loading={busy === 'whatsapp'}
          onClick={handleWhatsApp}
        >
          WhatsApp
        </Button>
        <Button variant="primary" className="col-span-2" icon={FiMail} loading={busy === 'email'} onClick={handleEmail}>
          Share via Email
        </Button>
      </div>
    </Modal>
  )
}
