<template>
  <div class="cu-timeline-item">
    <div class="background-primary h-24 w-24">Icon</div>
    <div class="background-purple h-60 w-2">Line</div>
    <div>Content</div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'

@Component
export default class CUTimelineItem extends Vue {
  @Inject({ default: false }) isInTimeline: boolean
}
</script>
