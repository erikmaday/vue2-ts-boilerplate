<template>
  <div>
    <template v-if="bidDetail.getShowLoaders">
      <CUSkeletonLoader type="detail-text" />
      <CUSkeletonLoader type="detail-text" classes="margin-b-4 margin-t-2" />
    </template>
    <template v-else-if="currentBidPrice">
      <p class="font-14">{{ priceLabel }}: {{ calculatedPrice }}</p>
      <p class="font-14 margin-b-4">
        Actual awarded price would be: {{ awardedPrice }}
      </p>
    </template>
    <CUSkeletonLoader v-if="bidDetail.getShowLoaders" type="button" />
    <v-btn
      v-else
      color="primary"
      :text="bidDetail.getIsEditingPrevented"
      :outlined="!bidDetail.getIsEditingPrevented"
      small
      class="w-full margin-t-0"
      :class="{ 'font-book': bidDetail.getIsEditingPrevented }"
      :loading="bidDetail.getSubmitting"
      @click="bidDetail.setIsEnteringBid(true)"
    >
      {{ customBidButtonText }}
    </v-btn>
    <CUSkeletonLoader
      v-if="bidDetail.getShowLoaders"
      type="text"
      width="120px"
      classes="margin-t-6 margin-x-auto"
    />
    <v-btn
      v-else-if="!isMultiBid && !bidDetail.getIsSoldOut"
      :text="!bidDetail.getIsEditingPrevented"
      :outlined="bidDetail.getIsEditingPrevented"
      small
      color="primary"
      class="w-full margin-t-4"
      :loading="bidDetail.getSubmitting"
      @click="markSoldOut"
    >
      Mark as Sold Out
    </v-btn>
  </div>
</template>

<script lang="ts">
import bidDetail from '@/store/modules/bidDetail'
import { TakeRate } from '@/utils/enum'
import { currencyFilter } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailActionsStandard extends Vue {
  @Prop({ required: true }) readonly isMultiBid!: boolean
  bidDetail = bidDetail

  get currentBidPrice(): number | null {
    return bidDetail.getBidAmount || bidDetail.getBid?.bidAmount || null
  }

  get customBidButtonText(): string {
    if (bidDetail.getIsEditingPrevented) {
      return 'Change Price'
    }
    if (this.currentBidPrice) {
      return 'Edit Bid'
    }
    return 'Make Bid'
  }

  get priceLabel(): string {
    if (bidDetail.getIsEditingPrevented) {
      return 'Automated Price'
    }
    return 'Calculated Price'
  }

  get calculatedPrice(): string {
    if (this.currentBidPrice) {
      return currencyFilter(this.currentBidPrice)
    }
    return ''
  }

  get awardedPrice(): string {
    if (this.currentBidPrice) {
      const brokerTakeRate = bidDetail.getBid?.takeRate || TakeRate.Default
      const operatorTakePercent = (100 - brokerTakeRate) / 100
      return currencyFilter(this.currentBidPrice * operatorTakePercent)
    }
    return ''
  }

  markSoldOut(): void {
    bidDetail.markSingleTripSoldOut(null)
  }
}
</script>
