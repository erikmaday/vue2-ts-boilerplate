<template>
  <BidDetailActionsStandard
    v-if="!enterCustomBid"
    @start-custom-bid="enterCustomBid = true"
  />
  <BidDetailActionsCustom v-else @cancel-custom-bid="enterCustomBid = false" />
</template>

<script lang="ts">
import { Trip } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BidDetailActionsStandard from '@/components/BidDetailActionsStandard.vue'
import BidDetailActionsCustom from '@/components/BidDetailActionsCustom.vue'

@Component({ components: { BidDetailActionsStandard, BidDetailActionsCustom } })
export default class BidDetailActions extends Vue {
  @Prop({ required: true }) readonly trip!: Trip
  enterCustomBid = false
}
</script>
