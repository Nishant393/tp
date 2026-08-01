import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiSave, FiRotateCcw, FiSun, FiMoon } from 'react-icons/fi'
import { useSettings } from '../context/SettingsContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { theme, toggleTheme } = useTheme()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: settings.name,
      addressLine1: settings.addressLine1,
      addressLine2: settings.addressLine2,
      phone1: settings.phones?.[0] || '',
      phone2: settings.phones?.[1] || '',
      email: settings.email,
      bankName: settings.bank?.bankName,
      accountName: settings.bank?.accountName,
      accountNumber: settings.bank?.accountNumber,
      ifsc: settings.bank?.ifsc,
    },
  })

  const onSubmit = (data) => {
    updateSettings({
      name: data.name,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      phones: [data.phone1, data.phone2].filter(Boolean),
      email: data.email,
      bank: {
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
      },
    })
    toast.success('Settings saved')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-5 lg:hidden">
        <h1 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
      </div>

      <Card className="p-5 mb-5 flex items-center justify-between" hover={false}>
        <div>
          <p className="font-medium text-sm text-slate-800 dark:text-slate-100">Appearance</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Toggle light or dark theme</p>
        </div>
        <button
          onClick={toggleTheme}
          className="btn-ripple flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {theme === 'dark' ? <FiMoon size={16} /> : <FiSun size={16} />}
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-5 mb-5" hover={false}>
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-slate-100">Company Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name" className="sm:col-span-2" {...register('name', { required: true })} />
            <Input label="Address Line 1" {...register('addressLine1')} />
            <Input label="Address Line 2" {...register('addressLine2')} />
            <Input label="Phone 1" {...register('phone1')} />
            <Input label="Phone 2" {...register('phone2')} />
            <Input label="Email" type="email" className="sm:col-span-2" {...register('email')} />
          </div>
        </Card>

        <Card className="p-5 mb-5" hover={false}>
          <h2 className="mb-4 font-display font-semibold text-slate-800 dark:text-slate-100">Bank Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Bank Name" {...register('bankName')} />
            <Input label="Account Name" {...register('accountName')} />
            <Input label="Account Number" {...register('accountNumber')} />
            <Input label="IFSC Code" {...register('ifsc')} />
          </div>
        </Card>

        <div className="flex gap-3 pb-6">
          <Button type="submit" icon={FiSave}>
            Save Settings
          </Button>
          <Button
            type="button"
            variant="outline"
            icon={FiRotateCcw}
            onClick={() => {
              resetSettings()
              toast.success('Reset to defaults')
            }}
          >
            Reset to Default
          </Button>
        </div>
      </form>
    </div>
  )
}
