<template>
  <CUItinerarySkeletonLoader v-if="bidDetail.getShowLoaders" :count="3" />
  <CUItinerary v-else-if="stops">
    <CUItineraryItem
      v-for="(stop, stopIndex) in stops"
      :key="`stop-${stopIndex}-${stop.stopId}`"
      :in-progress="stopIndex === 0"
      :upcoming="stopIndex !== stops.length - 1 && stopIndex !== 0"
      :last-stop="stopIndex === stops.length - 1"
    >
      <div class="padding-l-4 padding-b-4">
        <p class="font-medium margin-t-0">
          {{ formatStopAddress(stop) }}
        </p>
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CUItinerary from '@/components/CUItinerary.vue'
import CUItineraryItem from '@/components/CUItineraryItem.vue'
import CUItinerarySkeletonLoader from '@/components/CUItinerarySkeletonLoader.vue'
import { Stop } from '@/models/dto'
import { formatDropoffTime, formatPickupTime } from '@/utils/string'
import bidDetail from '@/store/modules/bidDetail'

@Component({
  components: { CUItinerary, CUItineraryItem, CUItinerarySkeletonLoader },
})
export default class BidDetailItinerary extends Vue {
  bidDetail = bidDetail
  formatDropoffTime = formatDropoffTime
  formatPickupTime = formatPickupTime

  get stops(): Stop[] {
    return bidDetail.getTrip?.stops
  }

  formatStopAddress(stop: Stop): string {
    return `${stop.address.city}, ${stop.address.state}`
  }
}
</script>
