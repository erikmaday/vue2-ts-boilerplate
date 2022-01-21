<template>
  <div class="cu-timeline-item d-flex">
    <div class="cu-timeline-item__divider position-relative top-0">
      <div
        class="cu-timeline-item__line w-2 h-full background-primary position-absolute z-0 top-2 left-one-half"
        style="transform: translateX(-50%)"
      />
      <slot name="icon">
        <img
          class="cu-timeline-item__icon h-16 w-16 position-relative top-0"
          :src="icon"
        />
      </slot>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import upcomingIcon from '@/assets/images/stopIcons/upcoming.png'
// UNCOMMENT WHEN WE WANT TO BEGIN SHOWING STOP STATUS ON ITINERARIES AGAIN
// import inprogressIcon from '@/assets/images/stopIcons/inprogress.png'
// import completedIcon from '@/assets/images/stopIcons/completed.png'
// import lastIcon from '@/assets/images/stopIcons/last.png'

@Component
export default class CUItineraryItem extends Vue {
  @Prop({ default: false }) upcoming: boolean
  @Prop({ default: false }) inProgress: boolean
  @Prop({ default: false }) completed: boolean
  @Prop({ default: false }) lastStop: boolean

  get icon(): any {
    // UNCOMMENT WHEN WE WANT TO BEGIN SHOWING STOP STATUS ON ITINERARIES AGAIN
    // if (this.lastStop) {
    //   return lastIcon
    // }
    // if (this.completed) {
    //   return completedIcon
    // }
    // if (this.inProgress) {
    //   return inprogressIcon
    // }
    return upcomingIcon
  }
}
</script>

<style lang="scss" scoped>
.cu-timeline-item:last-of-type {
  .cu-timeline-item__line {
    display: none;
  }
}
</style>
