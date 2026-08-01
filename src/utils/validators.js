/**
 * React Hook Form validation rules for the New Bill form.
 */
export const nameRule = {
  required: 'Customer name is required',
  minLength: { value: 2, message: 'Name must be at least 2 characters' },
}

export const mobileRule = {
  required: 'Mobile number is required',
  pattern: {
    value: /^[6-9]\d{9}$/,
    message: 'Enter a valid 10-digit Indian mobile number',
  },
}

export const emailRule = {
  validate: (value) =>
    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address',
}

export const gstinRule = {
  validate: (value) =>
    !value ||
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value) ||
    'Enter a valid 15-character GSTIN',
}

export const positiveNumberRule = {
  required: 'Required',
  min: { value: 0.01, message: 'Must be greater than 0' },
  valueAsNumber: true,
}

export const requiredRule = (label) => ({
  required: `${label} is required`,
})
