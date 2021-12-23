<template>
  <div>
    <template v-if="bid">
      <p class="font-14">Calculated Price: {{ calculatedPrice }}</p>
      <p class="font-14">Actual awarded price would be: {{ awardedPrice }}</p>
    </template>
    <v-btn
      color="primary"
      outlined
      small
      class="w-full margin-t-4"
      @click="$emit('start-custom-bid', true)"
    >
      {{ customBidButtonText }}
    </v-btn>
    <v-divider class="margin-t-4" />

    <p class="font-14 text-primary margin-t-5 text-align-center cursor-pointer">
      Don't do any of that and mark as sold out
    </p>
  </div>
</template>

<script lang="ts">
import { Bid } from '@/models/dto/Bid'
import { currencyFilter } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailActionsStandard extends Vue {
  @Prop({ required: true }) readonly bid!: Bid | null

  get customBidButtonText(): string {
    if (this.bid) {
      return 'Edit Bid'
    }
    return 'Make Bid'
  }

  get calculatedPrice(): string {
    if (this.bid) {
      return currencyFilter(this.bid.bidAmount)
    }
    return ''
  }

  get awardedPrice(): string {
    if (this.bid) {
      const operatorTakePercent = (100 - this.bid.takeRate) / 100
      return currencyFilter(this.bid.bidAmount * operatorTakePercent)
    }
    return ''
  }
}
</script>
