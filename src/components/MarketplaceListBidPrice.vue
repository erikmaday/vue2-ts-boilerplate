<template>
  <span v-if="formattedBidAmount">{{ formattedBidAmount }}</span>
  <v-btn v-else-if="!bid" small color="primary" @click="goToBidDetail">
    Bid
  </v-btn>
</template>
<script lang="ts">
import { Bid, TableViewTrip } from '@/models/dto'
import auth from '@/store/modules/auth'
import { currencyFilter } from '@/utils/string'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class MarketplaceListBidPrice extends Vue {
  @Prop({ required: true }) readonly row: TableViewTrip

  get bid(): Bid | null {
    return (
      this.row.bids.filter(
        (bid) => bid.active && bid.companyId === auth.getUser.companyId
      )[0] || null
    )
  }

  get isSoldOut(): boolean {
    return this.bid?.soldOut || false
  }

  get bidAmount(): number {
    return this.bid?.bidAmount || null
  }

  get formattedBidAmount(): string {
    if (this.bidAmount !== null) {
      return currencyFilter(this.bidAmount)
    }
    return null
  }

  goToBidDetail(): void {
    this.$router.push({
      name: 'bid-detail',
      params: { id: this.row.tripId.toString() },
    })
  }
}
</script>
