import { VuexModule, Module, Action } from 'vuex-class-modules'
import {
  Trip,
  TableViewTrip,
  BidPayloadVehicle,
  BidPayload,
} from '@/models/dto'
import { BidStatusId } from '@/utils/enum'
import tripService from '@/services/trip'
import { getExistingBidsByTripId } from '@/utils/bid'
import { TableViewBid } from '@/models/dto/TableViewBid'
import { filter } from '@/utils/filter'
import auth from './auth'
import deepClone from '@/utils/deepClone'

@Module({ generateMutationSetters: true })
class BidDetailModule extends VuexModule {
  // state
  trip: Trip | null = null
  trips: TableViewTrip[] | null = null
  tripDetails: Trip[] = []
  bids: { [tripId: number]: TableViewBid } | null = null
  isEnteringBid = false
  bidAmounts: { [tripId: number]: number | null } = {}
  bidAmount: number | null = null
  areAllSoldOut = false
  submitting = false

  // getters
  get getTrip() {
    return this.trip
  }

  get getTrips() {
    return this.trips
  }

  get getTripDetails() {
    return this.tripDetails
  }

  get getBids() {
    return this.bids
  }

  get getBid() {
    if (this.bids && this.trip) {
      return this.bids[this.trip.tripId]
    }
    return null
  }

  get getBidAmount() {
    return this.bidAmount
  }

  get getIsSoldOut() {
    if (this.bids && this.trip && !this.bidAmount) {
      return this.bids?.[this.trip.tripId]?.soldOut || false
    }
    return false
  }

  get getIsEnteringBid() {
    return this.isEnteringBid
  }

  get getBidAmounts() {
    return this.bidAmounts
  }

  get getAreAllSoldOut(): boolean {
    return this.areAllSoldOut
  }

  get getSubmitting(): boolean {
    return this.submitting
  }

  // mutations (mutations are autogenerated for each root level state field)

  // actions
  @Action
  reset(): void {
    this.trip = null
    this.trips = null
    this.tripDetails = []
    this.bids = null
    this.bidAmounts = {}
    this.bidAmount = null
    this.isEnteringBid = false
  }
  @Action
  async fetchTripsListByQuoteId(quoteId: number): Promise<void> {
    const params = {
      page: 1,
      pageSize: -1,
      sorts: undefined,
      filters: undefined,
    }
    const tripsResponse = await tripService.tableView(
      params,
      false,
      quoteId.toString()
    )
    this.trips = tripsResponse.data.resultList.map(
      (trip) => processTrip(trip) as TableViewTrip
    )
  }

  @Action
  async fetchTripsListByTripId(tripId: number): Promise<void> {
    const filters = filter()
    const filterParentAnd = filters.createParent('and')
    const filterTripId = {
      column: {
        _t_id: 'd971872d-fb98-4b7a-899d-1a47fc4551ae',
        prop: 'tripId',
        filterType: 'eq',
      },
      value: tripId,
    }
    filters.add(filterParentAnd, filterTripId)
    const params = {
      page: 1,
      pageSize: -1,
      sorts: undefined,
      filters: filters.asQueryParams(),
    }
    const tripsResponse = await tripService.tableView(params, false)
    this.trips = tripsResponse.data.resultList.map(
      (trip) => processTrip(trip) as TableViewTrip
    )
  }

  @Action
  async fetchAllTripDetails(tripIds: number[] = []): Promise<void> {
    if ((!tripIds.length || !tripIds) && this.trips) {
      tripIds = this.trips.map((trip) => trip.tripId)
    }
    if (tripIds.length) {
      const tripDetails: Trip[] = []
      for (const tripId of tripIds) {
        const trip = await fetchTripDetail(tripId)
        tripDetails.push(trip)
      }
      this.tripDetails = tripDetails
    }
  }

  @Action
  async fetchExistingBids(tripIds: number[] = []): Promise<void> {
    if ((!tripIds.length || !tripIds) && this.trips) {
      tripIds = this.trips.map((trip) => trip.tripId)
    }
    if (tripIds.length) {
      const bids: { [tripId: number]: TableViewBid } = {}
      const bidAmounts: { [tripId: number]: number | null } = {}
      for (const tripId of tripIds) {
        const bid = await fetchExistingBidByTripId(tripId)
        bids[tripId] = bid
        bidAmounts[tripId] = bid?.bidAmount || null
      }
      this.bidAmounts = bidAmounts
      this.bids = bids
      let allSoldOut = true
      for (const bid of Object.values(bids)) {
        if (!bid?.soldOut) {
          allSoldOut = false
          break
        }
      }
      this.areAllSoldOut = allSoldOut
    }
  }

  @Action
  selectTrip(tripId: number): void {
    this.trip = this.tripDetails.find((trip) => trip.tripId === tripId) || null
    this.bidAmount = this.bidAmounts[tripId] || null
  }

  @Action
  deselectTrip(): void {
    this.trip = null
    this.bidAmount = null
  }

  @Action
  setTripBidAmount(tripBid: { tripId: number; bidAmount: number }): void {
    this.bidAmounts[tripBid.tripId] = tripBid.bidAmount
    if (tripBid.tripId === this.trip?.tripId) {
      this.bidAmount = tripBid.bidAmount
    }
  }

  @Action
  async submitSingleTripBid(tripBid: {
    tripId: number
    bidAmount: number
  }): Promise<void> {
    this.submitting = true
    this.setTripBidAmount(tripBid)
    const payload = await this.buildSingleTripPayload()
    if (payload) {
      try {
        if (this.getBid || this.getIsSoldOut) {
          if (this.getBid?.bidId) {
            await bid.update(this.getBid.bidId, payload)
          }
        } else {
          await bid.create(payload)
        }
        await this.fetchExistingBids()
        this.setIsEnteringBid(false)
      } catch (err) {
        console.error(err)
      }
    }
    this.submitting = false
  }

  @Action
  setIsEnteringBid(value: boolean): void {
    this.isEnteringBid = value
  }

  @Action
  buildMultiTripPayload(trip: Trip): BidPayload | null {
    let payload = null
    const bidAmount = this.bidAmounts[trip.tripId]
    const originalBid = this.bids?.[trip.tripId]
    if (bidAmount) {
      payload = buildPayload(trip, bidAmount, originalBid, true)
    }
    return payload
  }

  @Action
  buildSingleTripPayload(): BidPayload | null {
    let payload = null
    if (this.trip) {
      const bid = this.bids?.[this.trip.tripId]
      const bidAmount = this.bidAmounts?.[this.trip.tripId]
      if (bidAmount) {
        payload = buildPayload(this.trip, bidAmount, bid)
      }
    }
    return payload
  }

  @Action
  async markAllTripsSoldOut(): Promise<void> {
    this.submitting = true
    if (this.tripDetails) {
      for (const trip of this.tripDetails) {
        await this.markSingleTripSoldOut(trip)
      }
      await this.fetchExistingBids()
    }
    this.submitting = false
  }

  @Action
  async markSingleTripSoldOut(trip: Trip | null): Promise<void> {
    this.submitting = true
    const isMultiTripBid = !!trip
    trip = trip || this.trip
    if (trip) {
      console.log(trip)
      try {
        const payload = await buildSoldOutPayload(trip)
        if (payload) {
          const bidId = this.getBids?.[trip.tripId]?.bidId
          if (bidId) {
            await bid.update(bidId, payload)
          } else {
            await bid.create(payload)
          }
          if (this.trip?.tripId) {
            this.bidAmounts[this.trip?.tripId] = null
          }
          if (!isMultiTripBid) {
            await this.fetchExistingBids()
            this.bidAmount = null
            this.setIsEnteringBid(false)
            this.submitting = false
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

// PRIVATE HELPERS

const processTrip = (trip: Trip | TableViewTrip): Trip | TableViewTrip => {
  if (trip.stops) {
    trip.stops = trip.stops.sort((a, b) => a.orderIndex - b.orderIndex)
  }
  return trip
}

const buildSoldOutPayload = (trip: Trip): BidPayload => {
  return {
    tripId: trip.tripId,
    companyId: auth.getUser.companyId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userId: auth.getUserId!,
    bidStatusId: BidStatusId.Pending,
    providerNotes: null,
    active: true,
    soldOut: true,
    bidAmount: 0,
    bidVehicles: [],
    driverCount: 0,
  }
}

const buildPayload = (
  trip: Trip,
  bidAmount: number,
  originalBid: TableViewBid | null = null,
  isMultiTripBid = false
): BidPayload => {
  const active = true
  let bidPassengerCount
  if (originalBid) {
    bidPassengerCount = originalBid.soldOut
      ? null
      : originalBid?.bidPassengerCount
  } else {
    bidPassengerCount = trip.passengerCount
  }

  const bidStatusId = BidStatusId.Pending
  const bidVehicles = buildBidVehicles(trip)
  const companyId = auth.getUser.companyId
  const driverCount = originalBid?.driverCount || trip.requiredDrivers
  const providerNotes = originalBid?.providerNotes || ''
  const tripId = trip.tripId
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = auth.getUserId!
  const existingBid = originalBid?.bidId || 0

  const payload: BidPayload = {
    active,
    bidAmount: bidAmount,
    bidPassengerCount,
    bidStatusId,
    bidVehicles,
    companyId,
    driverCount,
    providerNotes,
    tripId,
    userId,
  }
  if (isMultiTripBid) {
    payload.existingBid = existingBid
    const originalBidPayload = deepClone(payload)
    originalBidPayload.existingBid = existingBid
    originalBidPayload.bidAmount = originalBid?.bidAmount || 0
    payload.originalBid = originalBidPayload
  }
  return payload
}

const fetchTripDetail = async (tripId: number): Promise<Trip> => {
  const tripResponse = await tripService.byId(tripId)
  return processTrip(tripResponse.data.trip) as Trip
}

const fetchExistingBidByTripId = async (
  tripId: number
): Promise<TableViewBid> => {
  const bidsResult = await getExistingBidsByTripId(tripId)
  const existingBids = bidsResult.data.resultList.filter(
    (bid: TableViewBid) => bid.active
  )
  return existingBids?.[0] || null
}

const buildBidVehicles = (trip: Trip): BidPayloadVehicle[] => {
  return trip.vehicles.map((vehicle) => {
    const vehicleType = {
      active: true,
      companyId: null,
      ...vehicle.vehicleType,
    }
    return {
      quantity: vehicle.quantity,
      vehicleId: vehicle.vehicleId,
      vehicleType: vehicleType,
    }
  })
}

// register module
import store from '@/store/index'
import bid from '@/services/bid'
export default new BidDetailModule({ store, name: 'bidDetail' })
