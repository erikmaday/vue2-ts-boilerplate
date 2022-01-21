<template>
  <v-card class="border-radius-2x">
    <v-card-text class="padding-a-4">
      <CUSkeletonLoader
        type="text"
        width="47.5%"
        style="margin-right: 5%"
        classes="d-inline-flex border-radius-root"
      />
      <CUSkeletonLoader
        type="text"
        width="47.5%"
        classes="d-inline-flex border-radius-root"
      />
      <CUSkeletonLoader type="detail-text" />
      <div class="d-inline-flex margin-t-4 margin-b-2">
        <TripAssignmentIconsSkeletonLoader class="margin-r-4" />
        <TripAssignmentIconsSkeletonLoader />
      </div>
      <v-row class="align-center margin-t-2 margin-x-0 margin-b-0">
        <CUSkeletonLoader height="24px" width="33%" classes="d-inline-flex" />
        <v-spacer />
        <CUSkeletonLoader height="14px" width="47.5%" classes="d-inline-flex" />
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TripAssignmentIconsSkeletonLoader from '@/components/TripAssignmentIconsSkeletonLoader.vue'

@Component({
  components: { TripAssignmentIconsSkeletonLoader },
})
export default class BookingCardSkeletonLoader extends Vue {}
</script>
