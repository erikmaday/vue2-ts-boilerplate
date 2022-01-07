<template>
  <Main>
    <h1>Availability</h1>
    <p></p>
    <v-row align="start">
      <v-btn
        class="border-radius-2"
        x-small
        icon
        color="primary"
        @click="shiftCalendarDisplayDate(-1)"
      >
        <CUIcon width="20px" height="20px">keyboard_arrow_left</CUIcon>
      </v-btn>
      <AvailabilityCalendar :show-date="calendarDisplayDateAsJS" />
      <v-btn
        class="border-radius-2"
        x-small
        icon
        color="primary"
        @click="shiftCalendarDisplayDate(1)"
      >
        <CUIcon width="20px" height="20px">keyboard_arrow_right</CUIcon>
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
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue'
@Component({
  components: { Main, AvailabilityCalendar },
})
export default class Availability extends Vue {
  loadedDates = {
    startDatetime: dayjs().startOf('week').format('YYYY-MM-DD'),
    endDatetime: dayjs().endOf('week').format('YYYY-MM-DD'),
  }

  reservations: Reservation[] = []
  calendarDisplayDate = dayjs()

  get calendarDisplayDateAsJS(): Date {
    return this.calendarDisplayDate.toDate()
  }

  get calendarDisplayDateMonth(): string {
    return this.calendarDisplayDate.format()
  }

  async mounted(): Promise<void> {
    this.reservations = await this.getDispatchDataForDates(this.loadedDates)
  }

  async getDispatchDataForDates(
    dates: AvailabilityGetRequest
  ): Promise<Reservation[]> {
    const res = await availability.getData(dates)
    return res.data.reservations
  }

  shiftCalendarDisplayDate(numWeeks: number): void {
    this.calendarDisplayDate = this.calendarDisplayDate.add(numWeeks, 'week')
  }
}
</script>
