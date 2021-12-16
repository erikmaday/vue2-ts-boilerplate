import { Address } from './Address'
import { Trip } from './Trip'
import { Stop } from './Stop'
import { Customer } from './Customer'
import { VehicleAssignment } from './VehicleAssignment'
import { TableViewResult } from './TableView'

export interface Reservation {
  active: boolean
  assignedDriverPercentage: number
  assignedVehiclePercentage: number
  balance?: number
  bookingsPerYear?: number
  cancelledOn?: string
  childReservationId: number
  contractId?: number
  createdOn: string
  customer: Customer
  customerEmail: string
  customerId: number
  customerName: string
  customerPhone: number
  customerTotal: number
  distance: number
  drivingTime: number
  dueDate?: string
  firstDropoffAddress: Address
  firstPickupAddress: Address
  firstSentDate: string
  firstStopAddress: string
  firstStopAddressTimeZone: string
  hash: string
  lastDropoffDate: string
  managedContractId?: string
  managedId: number
  marketplaceClientTotal: number
  nearestMarketId: number
  nearestMarketName: string
  openForBid: boolean
  organization?: string
  parentReservationId: number
  parentReservationManagedId?: string
  passengerCount: number
  paymentStatus: string
  paymentStatusLabel: string
  quoteId: number
  quoteManagedId: number
  quoteType: number
  referralPassengerCount: number
  referralPaymentStatus: string
  referralPaymentStatusLabel: string
  referralStatus: string
  referralStatusLabel: string
  requiredVehiclesCount: number
  reservationId: number
  reservationStatus: string
  reservationStatusKey: string
  reservationStatusLabel: string
  startDate: string
  stops?: Stop[]
  trip: Trip
  tripRouteName?: string
  tripTypeLabel: string
  vehicleAssignments?: VehicleAssignment[]
}

export type ReservationTableViewResult = TableViewResult<Reservation>