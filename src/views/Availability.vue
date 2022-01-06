<template>
  <Main>
    <h1>Availability</h1>
  </Main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import availability from '@/services/availability'
import dayjs from 'dayjs'
import { AvailabilityGetRequest } from '@/models/dto/Availability'
import { Reservation } from '@/models/dto'
@Component({
  components: { Main },
})
export default class Availability extends Vue {
  loadedDates = {
    startDatetime: dayjs().startOf('week').format('YYYY-MM-DD'),
    endDatetime: dayjs().endOf('week').format('YYYY-MM-DD'),
  }

  reservations: Reservation[] = []

  async mounted(): Promise<void> {
    this.reservations = await this.getDispatchDataForDates(this.loadedDates)
  }

  async getDispatchDataForDates(dates: AvailabilityGetRequest): Promise<Reservation[]> {
    const res = await availability.getData(dates)
    return res.data.reservations
  }
}
</script>
