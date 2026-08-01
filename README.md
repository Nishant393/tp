# Orange Multipurpose Security Service — Billing App

A production-ready, mobile-first React billing/receipt generator for **Orange Multipurpose Security Service**, styled after a traditional printed invoice book with a modern orange & navy brand identity.

## Tech Stack
React 19 · Vite · React Router · Tailwind CSS v4 · React Hook Form · React Icons · React Hot Toast · html2canvas · jsPDF · FileSaver · Day.js · Framer Motion · qrcode.react

## Getting Started
```bash
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:5173).

To build for production:
```bash
npm run build
npm run preview
```

## Features
- **Dashboard** — total bills, today's bills, total revenue, recent bills, floating "New Bill" button
- **New Bill** — auto-generated bill number (`OMSS-YYYY-00001`), customer details with validation, dynamic items table (add/duplicate/delete, auto-calculated amounts), discount/tax summary, amount-in-words, live desktop preview / mobile preview modal, draft autosave + restore, unsaved-changes warning, Ctrl+S (save draft) / Ctrl+P (print) shortcuts
- **Invoice Preview** — A4-styled printable invoice with QR code, blue table header, orange company branding, bank details, stamp & signature area
- **PDF Export** — pixel-perfect, high-resolution A4 PDF of just the invoice (not the whole page), via html2canvas + jsPDF
- **Sharing** — WhatsApp (Web Share API with `wa.me` fallback) and Email (`mailto:` fallback) with the invoice PDF attached where supported
- **Print** — dedicated print stylesheet, hides UI chrome, perfect A4 margins
- **Bill History** — stored in `localStorage`, search by bill number/customer/mobile/date, pagination, view/edit/delete/download-again
- **Settings** — editable company info, bank details, light/dark theme (persisted)
- **PWA** — installable, offline app-shell caching via a service worker (sharing requires connectivity)
- Accessible (ARIA labels, semantic HTML, visible focus states), responsive from mobile to desktop, animated with Framer Motion

## Project Structure
```
src/
  components/
    layout/     Sidebar, BottomNav, Header, Footer, AppLayout
    ui/         Button, Input, TextArea, Select, Modal, Card, Spinner, Skeleton, StatCard, ShieldLogo
    invoice/    CustomerFields, ItemsTable, SummaryCard, InvoicePreview, ShareDialog
    history/    BillRow
  pages/        Dashboard, NewBill, History, BillView, Settings
  hooks/        useAutoSaveDraft, useUnsavedChangesWarning, useKeyboardShortcuts
  utils/        calculations, numberToWords, generateBillNumber, pdfGenerator, shareUtils, printInvoice, validators, id
  services/     storageService (localStorage)
  context/      BillsContext, SettingsContext, ThemeContext
  constants/    company, navigation
  styles/       index.css (Tailwind theme tokens + print rules)
```

## Notes
- Company info and bank details ship with the real OMSS details from the brief and are editable from **Settings**.
- Bill numbers are derived by scanning stored bills for the highest sequence used in the current year, so numbering stays correct even after deletions.
- The floating action button, bottom navigation, and preview modal are mobile-first; the sidebar and side-by-side live preview activate at the `lg` breakpoint.
# tp
