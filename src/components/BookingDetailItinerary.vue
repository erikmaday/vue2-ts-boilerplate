<template>
  <v-timeline align-top dense>
    <v-timeline-item
      v-for="(stop, stopIndex) in stops"
      :key="`stop-${stopIndex}-${stop.stopId}`"
      right
      :class="{
        last: stopIndex === stops.length - 1,
        inprogress: stopIndex === 0,
        upcoming: stopIndex !== stops.length - 1 && stopIndex !== 0,
      }"
    >
      <div class="padding-x-2 padding-b-2">
        <p class="font-medium margin-t-0">{{ formatStopAddress(stop) }}</p>
        <p v-if="stop.dropoffDatetime" class="text-gray-light margin-t-0">
          Estimated arrival:
          {{ formatStopTime(stop.dropoffDatetime, stop.address.timeZone) }}
        </p>
        <p v-if="stop.pickupDatetime" class="text-gray-light margin-t-0">
          Departure time:
          {{ formatStopTime(stop.pickupDatetime, stop.address.timeZone) }}
        </p>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts">
import { ReservationDetail, ReservationDetailStop } from '@/models/dto'
import { formatStopAddress } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BookingDetailHeader extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

  get stops(): ReservationDetailStop[] {
    return this.reservation?.stops
  }

  formatStopTime(time: string, timezone: string): string {
    const datetime = this.$dayjs(time).tz(timezone)
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  formatStopAddress = formatStopAddress
}
</script>

<style lang="scss" scoped></style>
