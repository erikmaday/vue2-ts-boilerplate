<template>
  <v-col class="grow padding-r-10 padding-b-0">
    <MarketplaceCard
      v-for="(trip, tripIndex) in bidDetail.trips"
      :trip="trip"
      :key="`${trip.tripId}-${tripIndex}-${bidDetail.getAreAllSoldOut}`"
      class="margin-b-4 last-of-type:margin-b-0"
    />
    <v-btn
      small
      color="primary"
      :disabled="!areAllBidsComplete"
      class="margin-t-4 w-full"
      :loading="bidDetail.getSubmitting"
      @click="submit"
    >
      Submit Bids
    </v-btn>
    <template v-if="!bidDetail.getAreAllSoldOut">
      <v-divider class="margin-t-4 margin-b-2" />
      <v-btn
        text
        small
        color="primary"
        class="w-full"
        :loading="bidDetail.getSubmitting"
        @click="markSoldOut"
      >
        Mark as Sold Out
      </v-btn>
    </template>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MarketplaceCard from '@/components/MarketplaceCard.vue'
import bidDetail from '@/store/modules/bidDetail'
import bid from '@/services/bid'

@Component({ components: { MarketplaceCard } })
export default class BidDetailMultiSidebar extends Vue {
  bidDetail = bidDetail

  get areAllBidsComplete(): boolean {
    let isComplete = false
    if (bidDetail.getTrips) {
      isComplete = true
      for (const trip of bidDetail.getTrips) {
        if (!bidDetail.getBidAmounts?.[trip.tripId]) {
          isComplete = false
          break
        }
      }
    }
    return isComplete
  }

  async submit(): void {
    await bidDetail.submitMultiTripBids()
  }

  async markSoldOut(): Promise<void> {
    await bidDetail.markAllTripsSoldOut()
  }
}
</script>
