<template>
  <div>
    <template v-if="$vuetify.breakpoint.smAndUp || !enableMobileView">
      <div class="d-inline-flex margin-l-3 align-center">
        <CUSkeletonLoader
          v-if="showLabel"
          class="margin-r-5"
          width="100px"
          height="20px"
        />
        <CUSkeletonLoader
          v-for="tripAssignment in 3"
          :key="`trip-assignment-skeleton-${tripAssignment}`"
          height="32px"
          width="32px"
          type="avatar"
          class="d-inline-flex margin-l-n3"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TripAssignmentIconsSkeletonLoader extends Vue {
  @Prop({ required: false, default: false }) readonly enableMobileView: boolean
  @Prop({ required: false, type: Boolean, default: false })
  readonly showLabel: boolean
}
</script>
