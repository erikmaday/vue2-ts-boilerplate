<template>
  <MapWithSidebar>
    <template v-slot:sidebar>
      <v-row>
        <v-col class="shrink padding-r-0">
          <CUSkeletonLoader v-if="bidDetail.getShowLoaders" type="icon" />
          <CUIcon
            v-else
            color="primary"
            class="margin-t-1 cursor-pointer"
            @click="goBack(false)"
          >
            arrow_left
          </CUIcon>
        </v-col>
        <BidDetailUnsavedChanges
          v-if="showUnsavedChangesWarning"
          @leave-page="goBack(true)"
          @cancel="showUnsavedChangesWarning = false"
        />
        <BidDetailChangePriceMessage
          v-else-if="bidDetail.getShowChangePriceMessage"
        />
        <BidDetailMultiSidebar v-else-if="isModeMulti && !bidDetail.trip" />
        <BidDetailSingleSidebar
          v-else-if="isModeSingle || bidDetail.getTrip"
          :trip="bidDetail.getTrip"
          :is-multi-bid="isModeMulti"
        />
      </v-row>
    </template>
    <template v-slot:map>
      <CUSkeletonLoader v-if="bidDetail.getShowLoaders" height="100%" />
      <BidDetailMap v-if="mapTrips && !loading" :trips="mapTrips" />
    </template>
  </MapWithSidebar>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import MapWithSidebar from '@/layouts/MapWithSidebar.vue'
import BidDetailMap from '@/components/BidDetailMap.vue'
import BidDetailMultiSidebar from '@/components/BidDetailMultiSidebar.vue'
import BidDetailSingleSidebar from '@/components/BidDetailSingleSidebar.vue'
import BidDetailUnsavedChanges from '@/components/BidDetailUnsavedChanges.vue'
import BidDetailChangePriceMessage from '@/components/BidDetailChangePriceMessage.vue'
import MarketplaceCard from '@/components/MarketplaceCard.vue'
import { Trip } from '@/models/dto'
import {
  formatDropoffTime,
  formatPickupTime,
  formatStopAddress,
} from '@/utils/string'
import app from '@/store/modules/app'
import bidDetail from '@/store/modules/bidDetail'

@Component({
  components: {
    MapWithSidebar,
    MarketplaceCard,
    BidDetailMap,
    BidDetailMultiSidebar,
    BidDetailSingleSidebar,
    BidDetailUnsavedChanges,
    BidDetailChangePriceMessage,
  },
})
export default class BidDetail extends Vue {
  @Provide('isInBidDetail') private isInBidDetail = true
  quoteId: number | null = null
  notFound = false
  formatStopAddress = formatStopAddress
  formatDropoffTime = formatDropoffTime
  formatPickupTime = formatPickupTime
  bidDetail = bidDetail
  loading = false
  showUnsavedChangesWarning = false

  get isModeMulti(): boolean {
    return bidDetail.getTrips?.length > 1
  }

  get isModeSingle(): boolean {
    return bidDetail.getTrips?.length === 1
  }

  get mapTrips(): Trip[] {
    if (bidDetail.getTrip) {
      return bidDetail.getTripDetails.filter(
        (trip) => trip.tripId === bidDetail.getTrip?.tripId
      )
    }
    return bidDetail.getTripDetails
  }

  created(): void {
    bidDetail.reset()
    this.quoteId = parseInt(this.$route.params.id)
  }
  mounted(): void {
    this.refresh()
  }

  async refresh(): Promise<void> {
    this.loading = true
    await bidDetail.fetchTrips(this.quoteId)
    this.loading = false
  }

  goBack(ignoreUnsavedChanges = false): void {
    if (bidDetail.getShowChangePriceMessage) {
      bidDetail.setIsEnteringBid(false)
    } else if (this.isModeMulti && bidDetail.getTrip) {
      bidDetail.deselectTrip()
    } else if (
      this.isModeMulti &&
      bidDetail.getIsSubmitEnabled &&
      !ignoreUnsavedChanges
    ) {
      this.showUnsavedChangesWarning = true
    } else {
      this.$router.push(app.getLastRoute)
    }
  }
}
</script>
