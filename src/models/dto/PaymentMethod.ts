export enum PaymentMethodKeys {
  CREDIT_CARD = 'credit_card',
  ACH = 'ach',
  CHECK = 'check',
}

export interface PaymentMethodType {
  id: number
  key: PaymentMethodKeys
  label?: string
  description?: string
}

export interface PaymentMethod {
  tripPaymentMethodId: number
  isAllowed: number
  tripId: number
  paymentMethodTypeId: number
  paymentMethodType: PaymentMethodType
}
