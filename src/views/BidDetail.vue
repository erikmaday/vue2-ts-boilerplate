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
        <v-col v-if="trip" class="grow padding-r-10">
          <BidDetailHeader :trip="trip" />
          <BidDetailItinerary class="margin-t-8" :trip="trip" />
          <BidDetailTripNumbers class="margin-t-6" :trip="trip" />
          <BidDetailNotes class="margin-t-8" :trip="trip" />
          <v-divider class="margin-t-8" />
          <BidDetailActions class="margin-t-8" :trip="trip" />
        </v-col>
      </v-row>
    </template>
    <template v-slot:map><BidDetailMap v-if="trip" :trip="trip" /></template>
  </MapWithSidebar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MapWithSidebar from '@/layouts/MapWithSidebar.vue'
import BidDetailHeader from '@/components/BidDetailHeader.vue'
import BidDetailItinerary from '@/components/BidDetailItinerary.vue'
import BidDetailTripNumbers from '@/components/BidDetailTripNumbers.vue'
import BidDetailNotes from '@/components/BidDetailNotes.vue'
import BidDetailActions from '@/components/BidDetailActions.vue'
import BidDetailMap from '@/components/BidDetailMap.vue'
import trip from '@/services/trip'
import { Stop, Trip } from '@/models/dto'
import {
  formatDropoffTime,
  formatPickupTime,
  formatStopAddress,
} from '@/utils/string'
import app from '@/store/modules/app'
@Component({
  components: {
    MapWithSidebar,
    BidDetailHeader,
    BidDetailItinerary,
    BidDetailTripNumbers,
    BidDetailNotes,
    BidDetailActions,
    BidDetailMap,
  },
})
export default class BidDetail extends Vue {
  id: number | null = null
  trip: Trip = null
  formatStopAddress = formatStopAddress
  formatDropoffTime = formatDropoffTime
  formatPickupTime = formatPickupTime

  created(): void {
    this.id = parseInt(this.$route.params.id)
  }

  mounted(): void {
    this.refresh()
  }

  async refresh(): Promise<void> {
    await this.getTrip()
  }

  async getTrip(): Promise<void> {
    try {
      if (this.id) {
        const tripResponse = await trip.byId(this.id)
        this.trip = this.processTrip(tripResponse.data.trip)
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

  processTrip(trip: Trip): Trip {
    trip.stops = this.sortStopsByOrderIndex(trip.stops)
    return trip
  }

  sortStopsByOrderIndex(stops: Stop[]): Stop[] {
    return stops.sort((a, b) => a.orderIndex - b.orderIndex)
  }

  goBack(): void {
    this.$router.push(app.getLastRoute)
  }

  get stops(): Stop[] {
    return this.trip?.stops
  }
}
</script>
