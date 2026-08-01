import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import { nameRule, mobileRule, emailRule, gstinRule } from '../../utils/validators'

/** Customer detail fields for the New Bill form. */
export default function CustomerFields({ register, errors }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Customer Name" required placeholder="e.g. Rohit Sharma" error={errors.customerName?.message} {...register('customerName', nameRule)} />
      <Input label="Company Name" placeholder="Optional" {...register('companyName')} />
      <Input label="GSTIN" placeholder="27ABCDE1234F1Z5" error={errors.gstin?.message} {...register('gstin', gstinRule)} />
      <Input label="State" placeholder="e.g. Maharashtra" {...register('state')} />
      <Input label="State Code" placeholder="e.g. 27" {...register('stateCode')} />
      <Input label="Mobile Number" required placeholder="9876543210" error={errors.mobile?.message} {...register('mobile', mobileRule)} />
      <Input label="Email" placeholder="customer@email.com" error={errors.email?.message} {...register('email', emailRule)} className="sm:col-span-2" />
      <TextArea label="Address" placeholder="Customer address" className="sm:col-span-2" {...register('address')} />
      <TextArea label="Notes" placeholder="Any additional notes for this bill" className="sm:col-span-2" {...register('notes')} />
    </div>
  )
}
