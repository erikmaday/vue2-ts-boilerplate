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
    <v-btn color="primary" small class="w-full margin-t-4">Submit</v-btn>
    <v-btn
      color="primary"
      text
      small
      class="w-full margin-t-4"
      @click="cancelCustomBid"
    >
      Cancel
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { currency as currencyMask } from '@/utils/mask'
import { currencyFilter } from '@/utils/string'

@Component
export default class BidDetailActionsCustom extends Vue {
  customBidPrice = null
  currencyMask = currencyMask

  get customBidRawValue(): number | null {
    if (this.customBidPrice) {
      return parseFloat(this.customBidPrice.replace(/,/g, ''))
    }
    return null
  }

  get awardedPriceFormatted(): string | null {
    if (this.customBidRawValue) {
      return currencyFilter(this.customBidRawValue * 0.9)
    }
    return null
  }

  cancelCustomBid(): void {
    this.$emit('cancel-custom-bid')
    this.enterCustomBid = false
  }
}
</script>

<style lang="scss" scoped>
::v-deep input {
  text-align: center;
}
</style>
