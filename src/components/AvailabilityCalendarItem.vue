<template>
  <div
    :class="`cv-item ` + classes.join(' ')"
    class="h-60 padding-a-0"
    :style="`border: none; top: ${top}px`"
  >
    <div
      style="height: calc(100% - 16px)"
      class="
        d-flex
        flex-column
        justify-space-around
        margin-a-2
        padding-a-1
        background-accent
        font-14
      "
    >
      <p class="margin-a-0" style="overflow: hidden;">{{ item.reservationId }}</p>
      <p class="margin-a-0" style="overflow: hidden; text-overflow: ellipsis">
        {{ `${item.firstStop} > ${item.lastStop}` }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { AvailabilityBlock } from '@/models/dto/Availability'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AvailabilityCalendarItem extends Vue {
  @Prop({})
  item!: AvailabilityBlock

  @Prop({
    required: true,
    type: Number,
  })
  top!: number

  @Prop({
    required: true,
    type: Array,
  })
  classes!: string[]
}
</script>
