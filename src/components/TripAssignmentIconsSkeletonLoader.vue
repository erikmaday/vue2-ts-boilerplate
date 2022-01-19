<template>
  <div>
    <template v-if="$vuetify.breakpoint.smAndUp || !enableMobileView">
      <div class="d-inline-flex margin-l-3 align-center">
        <CUSkeletonLoader
          v-if="showLabel"
          classes="margin-r-5"
          width="100px"
          height="20px"
        />
        <CUSkeletonLoader
          v-for="tripAssignment in 3"
          :key="`trip-assignment-skeleton-${tripAssignment}`"
          height="32px"
          width="32px"
          type="avatar"
          classes="d-inline-flex margin-l-n3"
        />
      </div>
    </template>
    <!-- HANDLE THIS WHEN WE ADD THIS TO THE BOOKINGS TV -->
    <!-- <template v-else>
      <div class="d-flex justify-space-between">
        <h4>Vehicle Assignments</h4>
        <div class="text-right">
          <span v-html="vehicleAssignmentMobileBody"></span>
        </div>
      </div>
    </template> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TripAssignmentIconsSkeletonLoader extends Vue {
  @Prop({ required: false, default: false }) readonly enableMobileView: boolean
  @Prop({ required: false }) readonly showLabel: boolean
}
</script>
