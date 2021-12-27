<template>
  <v-col v-if="bidDetail.getTrip" class="grow padding-r-10 padding-b-0">
    <BidDetailHeader />
    <BidDetailItinerary class="margin-t-8" />
    <BidDetailTripNumbers class="margin-t-6" />
    <div
      class="position-sticky bottom-0 background-white padding-b-5 margin-b-0"
    >
      <v-divider class="margin-t-8" />
      <BidDetailActions class="margin-t-4" :is-multi-bid="isMultiBid" />
    </div>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BidDetailHeader from '@/components/BidDetailHeader.vue'
import BidDetailItinerary from '@/components/BidDetailItinerary.vue'
import BidDetailTripNumbers from '@/components/BidDetailTripNumbers.vue'
import BidDetailActions from '@/components/BidDetailActions.vue'
import bidDetail from '@/store/modules/bidDetail'

@Component({
  components: {
    BidDetailHeader,
    BidDetailItinerary,
    BidDetailTripNumbers,
    BidDetailActions,
  },
})
export default class BidDetailSingleSidebar extends Vue {
  @Prop({ required: true }) readonly isMultiBid!: boolean
  bidDetail = bidDetail

  created(): void {
    if (!this.isMultiBid) {
      bidDetail.fetchExistingBids()
    }
  }
}
</script>
