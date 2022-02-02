import { Trip, VehicleAssignment } from '.'
import { TableViewResult } from '../TableView'

export interface Reservation {
  active: boolean
  amount: number
  assignedDriverPercentage: number
  assignedVehiclePercentage: number
  balance: number
  bookedByName: string
  cancelledOn: string | null
  ccVerified: boolean
  charterUpQuote: boolean
  checkoutPageId: null
  childId: string | null
  confirmed: boolean
  contractId: number | null
  createdOn: string
  customerAccountName: string | null
  customerEmail: string
  customerName: string
  customerTotal: number
  distance: number
  driverInfoEmailSent: boolean
  drivingTime: number
  dropoffDate: string
  dueDate: string | null
  enterpriseTrackingOnly: null
  firstDropoffAddressName: string
  firstPickupAddressName: string
  firstPickupTimeZone: string
  firstSentDate: string | null
  grossProfit: number
  hash: string | null
  managedContractId: string | null
  managedId: string
  marketplaceClientTotal: number | null
  openForBid: boolean
  parentReservationId: number | null
  paymentStatus: string
  pickupDate: string
  pickupLocation: string
  quotedOn: null
  quoteManagedId: number
  referralId: null
  referralPassengerCount: number | null
  referralPaymentStatus: string
  referralStatus: string
  referralStatusKey: string | null
  referredAmount: number
  referringCompany: string
  requiredDrivers: null
  reservationId: number
  reservationStatus: string
  reservationStatusKey: string | null
  reservationType: number
  sentDate: string
  tripId: number
  tripTypeLabel: string
  trip?: Trip
  vehicleAssignments: VehicleAssignment[]
}

export type ReservationTableViewResult = TableViewResult<Reservation>
