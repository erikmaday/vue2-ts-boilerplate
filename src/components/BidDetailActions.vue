<template>
  <BidDetailActionsStandard
    v-if="!enterCustomBid"
    :bid="bid"
    @start-custom-bid="enterCustomBid = true"
  />
  <BidDetailActionsCustom
    v-else
    :trip="trip"
    :bid="bid"
    @update="handleUpdate"
    @cancel-custom-bid="enterCustomBid = false"
  />
</template>

<script lang="ts">
import { Bid, Trip } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BidDetailActionsStandard from '@/components/BidDetailActionsStandard.vue'
import BidDetailActionsCustom from '@/components/BidDetailActionsCustom.vue'

@Component({ components: { BidDetailActionsStandard, BidDetailActionsCustom } })
export default class BidDetailActions extends Vue {
  @Prop({ required: true }) readonly trip!: Trip
  @Prop({ required: true }) readonly bid!: Bid | null
  enterCustomBid = false

  handleUpdate(): Promise<void> {
    this.enterCustomBid = false
    this.$emit('refresh')
  }
}
</script>
