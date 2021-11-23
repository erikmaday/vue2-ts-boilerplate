import dayjs from 'dayjs'
import { Trip } from './Trip'
import { CheckoutType } from './CheckoutType'
import { Customer } from './Customer'
import { LeadSourceType } from './LeadSource'
import { User } from './User'

export interface Quote {
  isActive: boolean
  isConverted: boolean
  isConfirmed: boolean
  currencyType: string
  checkoutPageId?: number
  leadSourceTypeId: number
  quoteId: number
  hash: string
  convertedOn?: dayjs.Dayjs
  contractId?: number
  customerId: number
  companyId: number
  createdById: number
  modifiedById?: number
  createdOn: dayjs.Dayjs
  updatedOn: dayjs.Dayjs
  referralTotal?: number
  referralMargin?: number
  referralPercentage?: number
  lastEmailTimestamp?: dayjs.Dayjs
  charterUpQuote: boolean
  decisionDate: dayjs.Dayjs
  expirationDate: dayjs.Dayjs
  expirationTimezone: string
  preferred?: boolean
  dueDate?: dayjs.Dayjs
  leadSourceType: LeadSourceType
  checkoutPage?: CheckoutType
  customer: Customer
  sentBy: User
  trips: Trip[]
  randomMultiplier?: number
  allowEcheckout: boolean
  attachPdfToEmail: boolean
  managedId: string
  quoteType: number
  termsId?: number
  contractName?: string
  contractIsOpen: boolean
  contractIsSigned: boolean
  contractStartDate?: dayjs.Dayjs
  contractEndDate?: dayjs.Dayjs
  contractNotes?: string
  contractBillingFrequency?: any
  contractBillingMethod?: any
  companyTerm?: any
  participatingInEmailCampaigns: boolean
  hasRecurrence: boolean
  firstPickupAddressId?: number
  firstDropoffAddressId?: number
  amount?: number
  customEmail?: boolean
  busNeededForEntireTrip: boolean
  total: number
  createdBy: User
  pricingTimeLabel: string
  priceForAllPricingMethods: boolean
}
