<template>
  <div
    class="
      w-32
      h-32
      border-radius-round
      d-inline-flex
      justify-center
      align-center
    "
    :class="{
      'border-1 border-solid': !imageSource || moreRequiredCount,
      'border-error background-error-background':
        (!imageSource && !noImageAvailable) || moreRequiredCount,
      'border-gray-light background-gray-header': noImageAvailable,
    }"
  >
    <img
      v-if="imageSource"
      :src="imageSource"
      width="32"
      height="32"
      class="
        border-radius-round border-white border-solid border-2
        object-fit-cover
      "
    />
    <p
      v-else-if="moreRequiredCount"
      class="text-error font-bold margin-a-0 padding-a-0"
    >
      +{{ moreRequiredCount }}
    </p>
    <CUIcon v-else :color="noImageAvailable ? 'gray-light' : 'error'">
      {{ iconName }}
    </CUIcon>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TripAssignmentIcon extends Vue {
  @Prop({ required: false }) readonly imageSource?: string
  @Prop({ required: false }) readonly noImageAvailable?: boolean
  @Prop({ required: false }) readonly iconName?: string
  @Prop({ required: false }) readonly moreRequiredCount?: number
}
</script>
