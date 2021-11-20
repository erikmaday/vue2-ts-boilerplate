export enum BasePaymentTypeKeys {
  FULL_PAYMENT = 'full_payment',
  DOWN_PAYMENT = 'down_payment',
  BILL_AFTER_SERVICES = 'bill_after_services',
}

export enum ExtendedPaymentTypeKeys {
  PARTIAL_PAYMENT = 'partial_payment',
  CREDIT = 'credit',
  MANUAL_PAYMENT = 'manual_payment',
  BILLING_INFO = 'billing_info',
  REFUND = 'refund',
}

const PaymentTypeKeys = {
  ...BasePaymentTypeKeys,
  ...ExtendedPaymentTypeKeys,
}

export type PaymentTypeKeys = BasePaymentTypeKeys | ExtendedPaymentTypeKeys

export type PaymentType = {
  id: number
  key: PaymentTypeKeys
  label?: string
  description?: string
}
