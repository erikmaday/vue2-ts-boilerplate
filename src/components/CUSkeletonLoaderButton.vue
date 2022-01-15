<template>
  <div>
    <v-skeleton-loader :width="width" height="40px" type="image" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class SkeletonLoaderButton extends Vue {
  @Prop({
    type: [String, Number],
    default: '100px', 
    required: false,
  })
  width!: string | number
}
</script>
