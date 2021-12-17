<template>
  <MapWithSidebar>
    <template v-slot:sidebar>
      <div>Bid Detail {{ id }}</div>
      <!-- <div v-if="trip">{{ trip }}</div> -->
      <p>{{ firstPickupCity }}>{{ firstDropoffCity }}</p>
      <p>{{ formattedStartDateTime }}</p>
      <CUItinerary v-if="stops">
        <CUItineraryItem
          v-for="(stop, stopIndex) in stops"
          :key="`stop-${stopIndex}-${stop.stopId}`"
          :in-progress="stopIndex === 0"
          :upcoming="stopIndex !== stops.length - 1 && stopIndex !== 0"
          :last-stop="stopIndex === stops.length - 1"
        >
          <div class="padding-l-4 padding-b-4">
            <p class="font-medium margin-t-0">{{ formatStopAddress(stop) }}</p>
            <p v-if="stop.dropoffDatetime" class="text-gray-light margin-t-0">
              Estimated arrival:
              {{ formatDropoffTime(stop) }}
            </p>
            <p v-if="stop.pickupDatetime" class="text-gray-light margin-t-0">
              Departure time:
              {{ formatPickupTime(stop) }}
            </p>
          </div>
        </CUItineraryItem>
      </CUItinerary>
    </template>
    <template v-slot:map></template>
  </MapWithSidebar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MapWithSidebar from '@/layouts/MapWithSidebar.vue'
import CUItinerary from '@/components/CUItinerary.vue'
import CUItineraryItem from '@/components/CUItineraryItem.vue'
import trip from '@/services/trip'
import { Stop, Trip } from '@/models/dto'
import {
  formatDropoffTime,
  formatPickupTime,
  formatStopAddress,
} from '@/utils/string'
@Component({ components: { MapWithSidebar, CUItinerary, CUItineraryItem } })
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
    // this.getTripAssignments()
    // this.getTrip()
  }

  async getTrip(): Promise<void> {
    try {
      if (this.id) {
        const tripResponse = await trip.byId(this.id)
        this.trip = tripResponse.data.trip
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

  get stops(): Stop[] {
    return this.trip?.stops
  }

  get firstPickupCity(): string {
    return this.trip?.stops[0].address.city
  }

  get firstDropoffCity(): string {
    return this.trip?.stops[1].address.city || this.firstPickupCity
  }

  get formattedStartDateTime(): string {
    const datetime = this.$dayjs(this.trip.startDate).tz(
      this.trip?.stops[0].address.timeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }
}
</script>
