import dayjs from 'dayjs'
import { Stop } from '.'

export enum TripTypeKeys {
  ONE_WAY = 'one_way',
  ROUND_TRIP = 'round_trip',
  HOURLY = 'hourly',
  DAILY = 'daily',
  SHUTTLE = 'shuttle',
}

export type Trip = {
  tripStatusId?: number
  checkoutTypeId?: number
  openForBid: boolean
  openForAllMarkets: boolean
  openForAllCompanies: boolean
  active: boolean
  allowMultipleBids?: boolean
  vehicleNeededEntireTrip?: boolean

  tripId?: number
  dueDate?: dayjs.Dayjs
  startDate?: dayjs.Dayjs
  total?: number
  depositPercentage?: number
  amountDueNow?: number
  quoteId: number
  requiredDrivers?: number
  passengerCount?: number
  description?: string
  distance?: number
  drivingTime?: number
  calendarDays?: number
  deadDistance?: number
  deadSeconds?: number
  companyId: number
  customerId?: number
  paymentTypeId?: number
  tripTypeId?: number
  notes?: string
  createdOn?: dayjs.Dayjs
  updatedOn?: dayjs.Dayjs
  leadCompanyId?: number
  leadGarageId?: number
  firstStopAddressId?: number
  firstDropoffAddressId?: number
  lastStopAddressId?: number
  lastStopId?: number
  biddingEndDate?: dayjs.Dayjs
  maxBidAmount?: number
  bookItNowAmount?: number
  allowedBiddingCompanyType?: string

  bidStart?: dayjs.Dayjs
  pricingMethod?: string
  pricingMarket?: number
  pricingGarageId?: number
  routeName: string

  stops?: Stop[]
}
