export enum PaymentMethodKeys {
  CREDIT_CARD = 'credit_card',
  ACH = 'ach',
  CHECK = 'check',
}

export type PaymentMethod = {
  id: number
  key: PaymentMethodKeys
  label?: string
  description?: string
}
