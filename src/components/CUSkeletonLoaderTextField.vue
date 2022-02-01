<template>
  <div>
    <CUSkeletonLoader
      v-if="!hideLabel"
      type="detail-text"
      width="70px"
      class="margin-y-1"
    />
    <CUSkeletonLoader type="text-field" :class="classes" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class CUSkeletonLoaderTextField extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  readonly hideDetails: boolean
  @Prop({ type: Boolean, required: false, default: false })
  readonly hideLabel: boolean

  get classes(): Record<string, boolean> {
    return { 'margin-b-7': !this.hideDetails }
  }
}
</script>
