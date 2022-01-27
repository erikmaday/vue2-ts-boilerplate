import { Address, Type, VehicleType } from '.'

export interface TableViewBid {
  bidId: number
  tripId: number
  companyId: number
  bidAmount: number
  userId: number
  quoteId: number
  reservationId?: null
  quoteManagedId: number
  reservationManagedId?: null
  createdOn: string
  acceptedOn?: null
  updatedOn?: null
  driverCount: number
  bidVehicles?: TableViewBidRequiredVehicle[] | null
  trip: TableViewBidTrip
  bidStatus: BidStatus
  marketName: string
  operatorMarketName: string
  operatorName: string
  isMarketplace: boolean
  active: boolean
  isConverted: boolean
  isPricedByPricingEngine: boolean
  providerNotes?: null
  soldOut: boolean
  bidPassengerCount: number
  takeRate: number
  markup: number
  quoteConverted: boolean
}
export interface TableViewBidRequiredVehicle {
  vehicleTypeId: number
  vehicleType: string
  requiredVehicles: number
}
export interface TableViewBidTrip {
  tripId: number
  tripTypeKey: string
  tripTypeLabel: string
  reservationId?: null
  reservationStatus?: null
  reservationStatusKey?: null
  companyId: number
  companyName: string
  startDate: string
  dueDate?: null
  createdOn: string
  total: number
  quoteId: number
  isQuoteConverted: boolean
  distance: number
  drivingTime: number
  stops?: TableViewBidStop[] | null
  customerId: number
  customerFirstName: string
  customerLastName: string
  requiredVehicles?: TableViewBidRequiredVehicle[] | null
  vehicles?: TableViewBidTripVehicle[] | null
  firstAddressId?: null
  lastAddressId?: null
  requiredDrivers: number
  passengerCount: number
  notes?: null
  bids?: null
  bidCount: number
  openForBid: boolean
  biddingEndDate: string
  maxBidAmount?: null
  bookItNowAmount?: null
  allowedBiddingCompanyType: string
  tripMarkets?: TableViewBidTripMarket[] | null
  tripCompanies?: TableViewBidTripCompany[] | null
  referrals?: null
  simpleReferrals?: null
  bidStart: string
  brokerNotes?: null
  allowMultipleBids: boolean
}

export interface TableViewBidStop {
  stopId: number
  orderIndex: number
  address: Address
  addressId?: null
  pickupDate?: string | null
  dropoffDate?: string | null
}

export interface TableViewBidTripVehicle {
  tripId: number
  vehicleType: VehicleType
  quantity: number
}

export interface TableViewBidTripMarket {
  id: number
  tripId: number
  marketId: number
}
export interface TableViewBidTripCompany {
  id: number
  tripId: number
  companyId: number
}
export interface BidStatus extends Type {
  id: number
}
