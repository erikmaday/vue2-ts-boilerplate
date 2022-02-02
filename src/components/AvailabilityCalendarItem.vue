<template>
  <!-- Inline styling to override default calendar settings -->
  <router-link
    :to="{
      name: 'booking-detail',
      params: { id: item.reservationId.toString() },
    }"
  >
    <div
      :class="`cv-item ` + classes.join(' ')"
      class="h-60 padding-a-0"
      :style="`border: none; top: ${top}px`"
    >
      <div
        style="height: calc(100% - 8px)"
        class="d-flex flex-column justify-space-around margin-a-1 padding-a-1 background-accent font-14"
      >
        <p class="margin-a-0 overflow-hidden">
          {{ item.managedReservationId }}
        </p>
        <p class="margin-a-0 overflow-hidden text-overflow-ellipsis">
          {{ `${item.firstStop} > ${item.lastStop}` }}
        </p>
      </div>
    </div>
  </router-link>
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
