<template>
  <div class="cu-timeline">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CUItinerary extends Vue {}
</script>
