<template>
  <div>
    <v-text-field
      outlined
      v-mask="[...currencyMask]"
      v-model="customBidPrice"
      prepend-inner-icon="mdi-currency-usd"
      class="text-align-center"
      hide-details
    />
    <p
      v-if="awardedPriceFormatted"
      class="font-14 text-gray-light text-align-center padding-t-0"
    >
      Actual awarded price would be {{ awardedPriceFormatted }}
    </p>
    <v-btn
      color="primary"
      small
      class="w-full margin-t-4"
      :loading="bidDetail.getSubmitting"
      @click="handleSave"
    >
      {{ submitButtonText }}
    </v-btn>
    <v-btn
      color="primary"
      text
      small
      class="w-full margin-t-4"
      :loading="bidDetail.getSubmitting"
      @click="bidDetail.setIsEnteringBid(false)"
    >
      Cancel
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { currency as currencyMask } from '@/utils/mask'
import { currencyFilter } from '@/utils/string'
import bidDetail from '@/store/modules/bidDetail'
import { TakeRate } from '@/utils/enum'

@Component
export default class BidDetailActionsCustom extends Vue {
  @Prop({ required: true }) readonly isMultiBid!: boolean

  customBidPrice: string | null = null
  currencyMask = currencyMask
  bidDetail = bidDetail

  mounted(): void {
    const bidAmount =
      bidDetail.getBidAmounts[bidDetail.getTrip?.tripId] ||
      bidDetail.getBid?.bidAmount
    if (bidAmount) {
      this.customBidPrice = currencyFilter(bidAmount).replace('$', '')
    }
  }

  get customBidRawValue(): number | null {
    if (this.customBidPrice) {
      return parseFloat(this.customBidPrice.replace(',', ''))
    }
    return null
  }

  get awardedPriceFormatted(): string | null {
    const takeRate = bidDetail.getBid?.takeRate || TakeRate.Default
    const operatorTakePercent = (100 - takeRate) / 100
    if (this.customBidRawValue) {
      return currencyFilter(this.customBidRawValue * operatorTakePercent)
    }
    return null
  }

  get submitButtonText(): string {
    return this.isMultiBid ? 'Save' : 'Submit'
  }

  handleSave(): void {
    if (this.isMultiBid) {
      bidDetail.setTripBidAmount({
        tripId: bidDetail.getTrip?.tripId,
        bidAmount: this.customBidRawValue,
      })
      bidDetail.setIsEnteringBid(false)
      bidDetail.deselectTrip()
    } else {
      this.submit()
    }
  }

  async submit(): Promise<void> {
    await bidDetail.submitSingleTripBid({
      tripId: bidDetail.getTrip?.tripId,
      bidAmount: this.customBidRawValue,
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep input {
  text-align: center;
}
</style>
