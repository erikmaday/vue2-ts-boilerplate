<template>
  <div class="d-inline-flex h-24 align-center">
    <CUSkeletonLoader
      v-for="index in count"
      :key="`pagination-loader-${index}`"
      width="10px"
      height="10px"
      classes="margin-x-2"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class PaginationSkeletonLoader extends Vue {
  @Prop({ type: Number, required: false, default: 3 }) readonly count: number
}
</script>
