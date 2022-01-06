import { Address, TableViewResult, Type, VehicleType } from '.'
export interface Bid {
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
  bidVehicles?: BidRequiredVehicle[] | null
  trip: BidTrip
  bidStatus: BidStatus
  marketName: string
  operatorMarketName: string
  operatorName: string
  isMarketplace: boolean
  active: boolean
  isConverted: boolean
  providerNotes?: null
  soldOut: boolean
  bidPassengerCount: number
  takeRate: number
  markup: number
  quoteConverted: boolean
}
export interface BidRequiredVehicle {
  vehicleTypeId: number
  vehicleType: string
  requiredVehicles: number
}
export interface BidTrip {
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
  stops?: BidStop[] | null
  customerId: number
  customerFirstName: string
  customerLastName: string
  requiredVehicles?: BidRequiredVehicle[] | null
  vehicles?: BidTripVehicle[] | null
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
  tripMarkets?: BidTripMarket[] | null
  tripCompanies?: BidTripCompany[] | null
  referrals?: null
  simpleReferrals?: null
  bidStart: string
  brokerNotes?: null
  allowMultipleBids: boolean
}

export interface BidStop {
  stopId: number
  orderIndex: number
  address: Address
  addressId?: null
  pickupDate?: string | null
  dropoffDate?: string | null
}

export interface BidTripVehicle {
  tripId: number
  vehicleType: VehicleType
  quantity: number
}

export interface BidTripMarket {
  id: number
  tripId: number
  marketId: number
}
export interface BidTripCompany {
  id: number
  tripId: number
  companyId: number
}
export interface BidStatus extends Type {
  id: number
}

export interface BidPayload {
  active: boolean
  bidAmount: number
  bidPassengerCount?: number | null
  bidStatusId: number
  bidVehicles: BidPayloadVehicle[] | null
  companyId: number
  driverCount: number
  providerNotes: string | null
  tripId: number
  userId: number
  existingBid?: number
  soldOut?: boolean
  originalBid?: {
    active: boolean
    bidAmount: number
    bidPassengerCount?: number | null
    bidStatusId: number
    bidVehicles: BidPayloadVehicle[] | null
    companyId: number
    driverCount: number
    providerNotes: string | null
    tripId: number
    userId: number
    existingBid?: number
  }
}

export interface BidPayloadVehicle {
  quantity: number
  vehicleId: number | null
  vehicleType: VehicleType
}

export type BidTableViewResult = TableViewResult<Bid>
