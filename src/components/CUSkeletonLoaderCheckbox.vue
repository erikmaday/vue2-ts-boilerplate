<template>
  <div
    class="d-flex align-center margin-t-4 padding-t-1"
    style="margin-bottom: 22px"
  >
    <CUSkeletonLoader type="checkbox" classes="d-inline-flex" />
    <CUSkeletonLoader
      type="text"
      :width="labelWidth"
      classes="d-inline-flex margin-l-2"
      :styles="styles"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class CUSkeletonLoaderCheckbox extends Vue {
  @Prop({ type: String, required: false, default: undefined })
  labelWidth: string
  @Prop({ type: Boolean, required: false, default: false })
  hideDetails: boolean

  get styles(): string {
    let styles = { 'margin-bottom': '22px' }
    if (this.hideDetails) {
      styles['margin-bottom'] = '8px'
    }
    return styles
  }
}
</script>
