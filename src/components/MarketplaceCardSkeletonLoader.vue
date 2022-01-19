<template>
  <v-card class="border w-full border-radius-2x">
    <v-card-text
      class="padding-x-4 padding-t-4"
      :class="{ 'padding-b-4': !showPagination, 'padding-b-1': showPagination }"
    >
      <CUSkeletonLoader
        type="text"
        width="47.5%"
        style="margin-right: 5%; margin-top: 2px"
        classes="d-inline-flex border-radius-root"
      />
      <CUSkeletonLoader
        type="text"
        width="47.5%"
        classes="d-inline-flex border-radius-root"
      />
      <CUSkeletonLoader type="detail-text" classes="margin-b-3" />
      <div class="d-flex align-center h-24">
        <CUSkeletonLoader width="20px" height="20px" classes="margin-r-2" />
        <CUSkeletonLoader width="50%" type="detail-text" />
      </div>
      <div class="d-flex align-center h-24">
        <CUSkeletonLoader width="20px" height="20px" classes="margin-r-2" />
        <CUSkeletonLoader width="33%" type="detail-text" />
      </div>
      <div class="d-flex justify-end">
        <CUSkeletonLoader
          v-if="isInBidDetail"
          height="24px"
          width="33%"
          classes="d-flex justify-end"
        />
        <CUSkeletonLoader
          v-else-if="showActionMessage"
          height="14px"
          width="47.5%"
          classes="margin-t-2"
        />
      </div>
    </v-card-text>
    <v-card-actions v-if="showPagination" class="padding-t-0">
      <v-row class="justify-center margin-x-0 margin-t-1 margin-b-0">
        <PaginationSkeletonLoader />
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import PaginationSkeletonLoader from '@/components/PaginationSkeletonLoader.vue'

@Component({ components: { PaginationSkeletonLoader } })
export default class MarketplaceCardSkeletonLoader extends Vue {
  @Inject({ from: 'isInBidDetail', default: false })
  readonly isInBidDetail!: boolean
  @Prop({ type: Boolean, required: false, default: false })
  readonly showPagination: boolean
  @Prop({ type: Boolean, required: false, default: false })
  readonly showActionMessage: boolean
}
</script>
