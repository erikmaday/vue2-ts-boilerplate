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
      :disabled="!bidDetail.getIsSubmitEnabled"
      class="margin-t-4 w-full"
      :loading="bidDetail.getSubmitting"
      @click="submit"
    >
      Submit Bids
    </v-btn>
    <v-btn
      v-if="!bidDetail.getAreAllSoldOut"
      text
      small
      color="primary"
      class="w-full margin-t-4"
      :loading="bidDetail.getSubmitting"
      @click="markSoldOut"
    >
      Mark as Sold Out
    </v-btn>
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

  async submit(): Promise<void> {
    await bidDetail.submitMultiTripBids()
  }

  async markSoldOut(): Promise<void> {
    await bidDetail.markAllTripsSoldOut()
  }
}
</script>
