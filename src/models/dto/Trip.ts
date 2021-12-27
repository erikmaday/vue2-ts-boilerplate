import dayjs from 'dayjs'
import { ApiResult, Bid, PaymentMethod, PaymentType, Stop } from '.'
import { CheckoutType } from './CheckoutType'
import { Customer } from './Customer'
import { GarageTimes } from './GarageTimes'
import { Vehicle } from './Vehicle'
import { TableViewResult } from './TableView'

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
  requiredVehicles?: RequiredVehicle[]
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

export interface RequiredVehicle {
  requiredVehicles: number
  vehicleType: string
  vehicleTypeId: number
}

export interface TripResult extends ApiResult {
  trip: Trip
}

export type TripTableViewResult = TableViewResult<TableViewTrip>
export interface TableViewTrip {
  bidCount: number
  parentReservationId?: number
  biddingEndDate: string
  bookItNowAmount?: number
  companyName: string
  bids?: Bid[] | null
  stops?: TableViewTripStop[] | null
  requiredVehicles?: TableViewTripRequiredVehicles[] | null
  requiredDrivers: number
  quoteId: number
  quoteManagedId: number
  tripId: number
  reservationId?: number
  managedId?: string
  total: number
  tripTypeLabel: string
  passengerCount: number
  referrals?: null
  customerId: number
  customerFirstName: string
  customerLastName: string
  maxBidAmount?: number
  notes?: string
}
export interface TableViewTripStop {
  stopId: number
  orderIndex: number
  address: Address
  addressId?: null
  pickupDate?: string | null
  dropoffDate?: string | null
}
export interface Address {
  addressId: number
  addressName: string
  street1: string
  street2?: null
  city: string
  state: string
  postalCode: number
  lat: number
  lng: number
  timeZone: string
  title: string
  completeAddress: string
}
export interface TableViewTripRequiredVehicles {
  vehicleTypeId: number
  vehicleType: string
  requiredVehicles: number
}
