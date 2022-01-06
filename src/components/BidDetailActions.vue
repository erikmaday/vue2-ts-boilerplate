<template>
  <BidDetailActionsStandard
    v-if="!bidDetail.getIsEnteringBid"
    :is-multi-bid="isMultiBid"
  />
  <BidDetailActionsCustom v-else :is-multi-bid="isMultiBid" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BidDetailActionsStandard from '@/components/BidDetailActionsStandard.vue'
import BidDetailActionsCustom from '@/components/BidDetailActionsCustom.vue'
import bidDetail from '@/store/modules/bidDetail'

@Component({ components: { BidDetailActionsStandard, BidDetailActionsCustom } })
export default class BidDetailActions extends Vue {
  @Prop({ required: true }) readonly isMultiBid!: boolean
  bidDetail = bidDetail
}
</script>
