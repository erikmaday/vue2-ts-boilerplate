<template>
  <CUItinerary>
    <CUItineraryItem
      v-for="(stop, stopIndex) in stops"
      :key="`stop-${stopIndex}-${stop.stopId}`"
      :in-progress="stopIndex === 0"
      :upcoming="stopIndex !== stops.length - 1 && stopIndex !== 0"
      :last-stop="stopIndex === stops.length - 1"
    >
      <div class="padding-l-4 padding-b-4">
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
    </CUItineraryItem>
  </CUItinerary>
</template>

<script lang="ts">
import { ReservationDetail, ReservationDetailStop } from '@/models/dto'
import { formatStopAddress } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'
import CUItinerary from '@/components/CUItinerary.vue'
import CUItineraryItem from '@/components/CUItineraryItem.vue'

@Component({ components: { CUItinerary, CUItineraryItem } })
export default class BookingDetailHeader extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

  get stops(): ReservationDetailStop[] {
    return this.reservation.stops
  }

  formatStopTime(time: string, timezone: string): string {
    const datetime = this.$dayjs(time).tz(timezone)
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  formatStopAddress = formatStopAddress
}
</script>

<style lang="scss" scoped></style>
