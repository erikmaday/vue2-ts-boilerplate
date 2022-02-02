<template>
  <v-col
    class="grow padding-r-10"
    :class="{
      'padding-b-4': $vuetify.breakpoint.smAndUp,
      'padding-b-6': $vuetify.breakpoint.xs,
    }"
  >
    <template v-for="(trip, tripIndex) in bidDetail.trips">
      <MarketplaceCardSkeletonLoader
        v-if="bidDetail.getShowLoaders"
        :key="`marketplace-card-skeleton-loader-${trip.tripId}-${tripIndex}`"
        class="margin-b-4 last-of-type:margin-b-0"
      />
      <MarketplaceCard
        v-else
        :trip="trip"
        :key="`${trip.tripId}-${tripIndex}-${bidDetail.getAreAllSoldOut}`"
        class="margin-b-4 last-of-type:margin-b-0"
      />
    </template>
    <CUSkeletonLoader v-if="bidDetail.getShowLoaders" type="button" />
    <v-btn
      v-else
      small
      color="primary"
      :disabled="!bidDetail.getIsSubmitEnabled"
      class="margin-t-4 w-full"
      :loading="bidDetail.getSubmitting"
      @click="submit"
    >
      Submit All Bids
    </v-btn>
    <CUSkeletonLoader
      v-if="bidDetail.getShowLoaders"
      type="text"
      width="120px"
      class="margin-t-6 margin-x-auto"
    />
    <v-btn
      v-else-if="!bidDetail.getAreAllSoldOut"
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
import MarketplaceCardSkeletonLoader from '@/components/MarketplaceCardSkeletonLoader.vue'
import bidDetail from '@/store/modules/bidDetail'
import app from '@/store/modules/app'

@Component({ components: { MarketplaceCard, MarketplaceCardSkeletonLoader } })
export default class BidDetailMultiSidebar extends Vue {
  bidDetail = bidDetail

  async submit(): Promise<void> {
    await bidDetail.submitMultiTripBids()
    this.$router.push(app.getLastRoute)
  }

  async markSoldOut(): Promise<void> {
    await bidDetail.markAllTripsSoldOut()
  }
}
</script>
