import dayjs from 'dayjs'
import { PaymentMethod, PaymentType, Stop } from '.'
import { CheckoutType } from './CheckoutType'
import { Customer } from './Customer'
import { GarageTimes } from './GarageTimes'
import { Vehicle } from './Vehicle'

export enum TripTypeKeys {
  ONE_WAY = 'one_way',
  ROUND_TRIP = 'round_trip',
  HOURLY = 'hourly',
  DAILY = 'daily',
  SHUTTLE = 'shuttle',
}

export interface Trip {
  tripStatusId: number
  openForBid: boolean
  openForAllMarkets: boolean
  openForAllCompanies: boolean
  tripId: number
  active: boolean
  dueDate: dayjs.Dayjs
  startDate: dayjs.Dayjs
  total: number
  depositPercentage: number
  amountDueNow: number
  quoteId: number
  requiredDrivers: number
  passengerCount: number
  description?: string
  distance: number
  drivingTime: number
  calendarDays: number
  deadDistance?: number
  deadSeconds?: number
  companyId: number
  customerId: number
  paymentTypeId: number
  tripTypeId: number
  notes?: string
  createdOn: dayjs.Dayjs
  updatedOn?: dayjs.Dayjs
  leadCompanyId?: number
  leadGarageId?: number
  firstStopAddressId: number
  firstDropoffAddressId: number
  lastStopAddressId: number
  lastStopId: number
  biddingEndDate: dayjs.Dayjs
  maxBidAmount?: number
  bookItNowAmount?: number
  allowedBiddingCompanyType: string
  allowMultipleBids: boolean
  bidStart: dayjs.Dayjs
  pricingMethod: string
  pricingMarket: number
  pricingGarageId?: number
  routeName?: string
  vehicleNeededEntireTrip: boolean
  tripType: TripType
  checkoutType: CheckoutType
  paymentType: PaymentType
  stops: Stop[]
  rates: any[]
  charges: TripCharge[]
  vehicles: Vehicle[]
  paymentMethods: PaymentMethod[]
  tripMarkets: TripMarket[]
  tripCompanies: TripCompany[]
  customer: Customer
  tripContact: TripContact
  garageTimes: GarageTimes
  parentTripId?: number
  hasRecurrence: boolean
  recurrenceTripCount: number
  recurrences: any[]
  recurringTripTotal?: number
  recurringAmountDueNow?: number
  recurrenceText?: string
  updateRecurringTrips: boolean
  updateRecurringTripsFromDate?: dayjs.Dayjs
  processingFeePercentage: number
  marketplaceDiscountPercent: number
  istripContactSelected: boolean
  processingFeeCharge: number
  endDate: dayjs.Dayjs
  hourlyDiff: number
  estimatedTimeLabel: string
  deadMileLabel: string
  liveMileLabel: string
  tripTypeKey: string
}

export interface TripType {
  id: number
  label: string
  key: string
  description?: string
}

export interface TripChargeType {
  id: number
  label: string
  key: string
  description?: string
}

export interface TripCharge {
  tripChargeId: number
  tripId: number
  chargeTypeId: number
  amount: number
  chargeType: TripChargeType
}

export interface TripMarket {
  tripId: number
  marketId: number
}

export interface TripCompany {
  tripId: number
  companyId: number
  activationDatetime: Date
}

export interface TripContact {
  firstName: string
  lastName: string
  email: string
  phone: string
}
