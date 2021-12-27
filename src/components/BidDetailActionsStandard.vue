<template>
  <div>
    <template v-if="currentBidPrice">
      <p class="font-14">Calculated Price: {{ calculatedPrice }}</p>
      <p class="font-14 margin-b-4">
        Actual awarded price would be: {{ awardedPrice }}
      </p>
    </template>
    <v-btn
      color="primary"
      outlined
      small
      class="w-full margin-t-0"
      @click="bidDetail.setIsEnteringBid(true)"
    >
      {{ customBidButtonText }}
    </v-btn>

    <template v-if="!isMultiBid">
      <v-divider class="margin-t-4" />
      <p
        class="font-14 text-primary margin-t-5 text-align-center cursor-pointer"
      >
        Mark as Sold Out
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import bidDetail from '@/store/modules/bidDetail'
import { currencyFilter } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

// we may pull this dynamically later on
const DEFAULT_TAKE_RATE = 10

@Component
export default class BidDetailActionsStandard extends Vue {
  @Prop({ required: true }) readonly isMultiBid!: boolean
  bidDetail = bidDetail

  get customBidButtonText(): string {
    if (bidDetail.getBid) {
      return 'Edit Bid'
    }
    return 'Make Bid'
  }

  get currentBidPrice(): number | null {
    return (
      bidDetail.getBidAmounts[bidDetail.getTrip?.tripId] ||
      bidDetail.getBid?.bidAmount ||
      null
    )
  }

  get calculatedPrice(): string {
    if (this.currentBidPrice) {
      return currencyFilter(this.currentBidPrice)
    }
    return ''
  }

  get awardedPrice(): string {
    if (this.currentBidPrice) {
      const brokerTakeRate = bidDetail.getBid?.takeRate || DEFAULT_TAKE_RATE
      const operatorTakePercent = (100 - brokerTakeRate) / 100
      return currencyFilter(this.currentBidPrice * operatorTakePercent)
    }
    return ''
  }
}
</script>
