<template>
  <div class="d-flex align-center padding-t-1">
    <CUSkeletonLoader type="checkbox" class="d-inline-flex" />
    <CUSkeletonLoader
      type="text"
      :width="labelWidth"
      class="d-inline-flex margin-l-2"
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

  get styles(): Record<string, string | number> {
    let styles = { 'margin-bottom': '22px' }
    if (this.hideDetails) {
      styles['margin-bottom'] = '8px'
    }
    return styles
  }
}
</script>
