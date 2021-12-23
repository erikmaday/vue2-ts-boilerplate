<template>
  <MapWithSidebar>
    <template v-slot:sidebar>
      <v-row>
        <v-col class="shrink padding-r-0">
          <CUIcon
            color="primary"
            class="margin-t-1 cursor-pointer"
            @click="goBack"
          >
            arrow_left
          </CUIcon>
        </v-col>
        <BidDetailMultiSidebar
          v-if="isModeMulti && !trip"
          :trips="trips"
          @select="selectTrip"
        />
        <BidDetailSingleSidebar v-if="trip" :trip="trip" />
      </v-row>
    </template>
    <template v-slot:map><BidDetailMap v-if="trip" :trip="trip" /></template>
  </MapWithSidebar>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import MapWithSidebar from '@/layouts/MapWithSidebar.vue'
import BidDetailMap from '@/components/BidDetailMap.vue'
import BidDetailMultiSidebar from '@/components/BidDetailMultiSidebar.vue'
import BidDetailSingleSidebar from '@/components/BidDetailSingleSidebar.vue'
import MarketplaceCard from '@/components/MarketplaceCard.vue'
import trip from '@/services/trip'
import { Stop, Trip } from '@/models/dto'
import {
  formatDropoffTime,
  formatPickupTime,
  formatStopAddress,
} from '@/utils/string'
import app from '@/store/modules/app'

const MULTI_BID_ROUTE_NAME = 'multi-bid-detail'
const SINGLE_BID_ROUTE_NAME = 'bid-detail'

@Component({
  components: {
    MapWithSidebar,
    MarketplaceCard,
    BidDetailMap,
    BidDetailMultiSidebar,
    BidDetailSingleSidebar,
  },
})
export default class BidDetail extends Vue {
  @Provide('isInBidDetail') private isInBidDetail = true
  quoteId: number | null = null
  tripId: number | null = null
  trip: Trip | null = null
  trips: Trip[] = null
  tripDetails: Trip[] | null = null
  formatStopAddress = formatStopAddress
  formatDropoffTime = formatDropoffTime
  formatPickupTime = formatPickupTime

  get stops(): Stop[] {
    return this.trip?.stops
  }

  get isModeMulti(): boolean {
    return this.$route.name === MULTI_BID_ROUTE_NAME
  }

  get isModeSingle(): boolean {
    return this.$route.name === SINGLE_BID_ROUTE_NAME
  }

  created(): void {
    if (this.$route.name === MULTI_BID_ROUTE_NAME) {
      this.quoteId = parseInt(this.$route.params.id)
    } else {
      this.tripId = parseInt(this.$route.params.id)
    }
  }
  mounted(): void {
    this.refresh()
  }
  async refresh(): Promise<void> {
    await this.getTrips()
  }
  async getTrips(): Promise<void> {
    try {
      let tripIds = this.isModeSingle ? [this.tripId] : []
      if (this.isModeMulti) {
        this.trips = await this.getTripsList()
        tripIds = this.trips.map((trip) => trip.tripId)
      }
      if (tripIds) {
        this.tripDetails = await this.getAllTripDetails(tripIds)
        if (this.isModeSingle) {
          this.selectTrip(this.tripId)
        }
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
      return
    }
  }

  async getTripsList(): Trip[] {
    const params = {
      page: 1,
      pageSize: -1,
      sorts: undefined,
      filters: undefined,
    }
    const tripsResponse = await trip.tableView(params, false, this.quoteId)
    return tripsResponse.data.resultList.map((trip) => this.processTrip(trip))
  }

  async getAllTripDetails(tripIds: number[]): Trip[] {
    const tripDetails: Trip[] = []
    for (const tripId of tripIds) {
      const trip = await this.getTripDetail(tripId)
      tripDetails.push(trip)
    }
    return tripDetails
  }

  async getTripDetail(tripId: number): Trip {
    const tripResponse = await trip.byId(tripId)
    return this.processTrip(tripResponse.data.trip)
  }

  processTrip(trip: Trip): Trip {
    trip.stops = this.sortStopsByOrderIndex(trip.stops)
    return trip
  }

  sortStopsByOrderIndex(stops: Stop[]): Stop[] {
    return stops.sort((a, b) => a.orderIndex - b.orderIndex)
  }

  goBack(): void {
    if (this.isModeMulti && this.trip) {
      this.trip = null
    } else {
      this.$router.push(app.getLastRoute)
    }
  }

  selectTrip(tripId: number): void {
    this.trip = this.tripDetails.find((trip) => trip.tripId === tripId)
  }
}
</script>
