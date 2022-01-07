<template>
  <Main>
    <h1>Availability</h1>
    <p></p>
    <v-row align="start">
      <!-- Inline styling needed to override default icon btn Vuetify settings -->
      <v-btn
        class="border-radius-2 background-primary margin-x-1"
        style="width: 28px"
        x-small
        icon
        color="primary"
        @click="shiftCalendarDisplayDate(-1)"
      >
        <CUIcon color="white" width="20px" height="20px">keyboard_arrow_left</CUIcon>
      </v-btn>
      <AvailabilityCalendar :show-date="calendarDisplayDateAsJS" />
      <v-btn
        class="border-radius-2 background-primary margin-x-1"
        style="width: 28px"
        x-small
        icon
        color="primary"
        @click="shiftCalendarDisplayDate(1)"
      >
        <CUIcon color="white" width="20px" height="20px">keyboard_arrow_right</CUIcon>
      </v-btn>
    </v-row>
  </Main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import availability from '@/services/availability'
import dayjs from 'dayjs'
import { AvailabilityGetRequest } from '@/models/dto/Availability'
import { Reservation } from '@/models/dto'
import { AvailabilityBlock } from '@/models/Availability'
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue'
import { convertReservationToAvailabilityBlock } from '@/utils/reservation'
import deepClone from '@/utils/deepClone'
@Component({
  components: { Main, AvailabilityCalendar },
})
export default class Availability extends Vue {
  loadedDates = {
    startDatetime: dayjs().startOf('week').format('YYYY-MM-DD'),
    endDatetime: dayjs().endOf('week').format('YYYY-MM-DD'),
  }

  loadedReservations: Record<number, AvailabilityBlock> = {}

  reservations: Reservation[] = []
  calendarDisplayDate = dayjs()

  get calendarDisplayDateAsJS(): Date {
    return this.calendarDisplayDate.toDate()
  }

  get calendarDisplayDateMonth(): string {
    return this.calendarDisplayDate.format()
  }

  async mounted(): Promise<void> {
    this.getDispatchDataForDates(this.loadedDates)
    // this.reservations = await this.getDispatchDataForDates(this.loadedDates)
  }

  async getDispatchDataForDates(
    dates: AvailabilityGetRequest
  ): Promise<void> {
    const res = await availability.getData(dates)
    console.log("> result:", res.data.reservations)

    for (const reservation of res.data.reservations) {
      const availabilityBlock =
        convertReservationToAvailabilityBlock(reservation)
      this.loadedReservations[availabilityBlock.reservationId] =
        deepClone(availabilityBlock)
    }
  }

  shiftCalendarDisplayDate(numWeeks: number): void {
    this.calendarDisplayDate = this.calendarDisplayDate.add(numWeeks, 'week')
  }
}
</script>