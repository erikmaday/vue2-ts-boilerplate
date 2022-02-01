<template>
  <div>
    <CUSkeletonLoader
      v-if="!hideLabel"
      type="detail-text"
      width="70px"
      classes="margin-y-1"
    />
    <CUSkeletonLoader type="text-field" :classes="classes" />
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

  get classes(): string {
    let classes = ''
    if (!this.hideDetails) {
      classes = `${classes} margin-b-7`
    }
    return classes
  }
}
</script>
