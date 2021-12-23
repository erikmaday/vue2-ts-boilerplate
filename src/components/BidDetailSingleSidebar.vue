<template>
  <v-col v-if="trip" class="grow padding-r-10 padding-b-0">
    <BidDetailHeader :trip="trip" />
    <BidDetailItinerary class="margin-t-8" :trip="trip" />
    <BidDetailTripNumbers class="margin-t-6" :trip="trip" />
    <BidDetailNotes class="margin-t-8" :trip="trip" />
    <div
      class="position-sticky bottom-0 background-white padding-b-5 margin-b-0"
    >
      <v-divider class="margin-t-8" />
      <BidDetailActions
        class="margin-t-8"
        :trip="trip"
        :bid="existingBid"
        @refresh="getExistingBid"
      />
    </div>
  </v-col>
</template>

<script lang="ts">
import { Bid, Trip } from '@/models/dto'
import { Vue, Component, Prop } from 'vue-property-decorator'
import BidDetailHeader from '@/components/BidDetailHeader.vue'
import BidDetailItinerary from '@/components/BidDetailItinerary.vue'
import BidDetailTripNumbers from '@/components/BidDetailTripNumbers.vue'
import BidDetailNotes from '@/components/BidDetailNotes.vue'
import BidDetailActions from '@/components/BidDetailActions.vue'
import { getExistingBidsByTripId } from '@/utils/bid'

@Component({
  components: {
    BidDetailHeader,
    BidDetailItinerary,
    BidDetailTripNumbers,
    BidDetailNotes,
    BidDetailActions,
  },
})
export default class BidDetailSingleSidebar extends Vue {
  @Prop({ required: true }) readonly trip!: Trip
  existingBid: Bid | null = null

  created(): void {
    this.getExistingBid()
  }

  async getExistingBid(): Promise<void> {
    const bidsResult = await getExistingBidsByTripId(this.trip.tripId)
    const existingBids = bidsResult.data.resultList.filter((bid) => bid.active)
    this.existingBid = existingBids?.[0] || null
  }
}
</script>
