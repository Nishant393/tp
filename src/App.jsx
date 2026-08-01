import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { BillsProvider } from './context/BillsContext'
import { SettingsProvider } from './context/SettingsContext'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import NewBill from './pages/NewBill'
import History from './pages/History'
import Settings from './pages/Settings'
import BillView from './pages/BillView'

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BillsProvider>
          <BrowserRouter>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '10px',
                  background: '#0A2E8A',
                  color: '#fff',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#F97316', secondary: '#fff' } },
              }}
            />
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-bill" element={<NewBill />} />
                <Route path="/edit-bill/:id" element={<NewBill />} />
                <Route path="/history" element={<History />} />
                <Route path="/bill/:id" element={<BillView />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BillsProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
