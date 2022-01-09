<template>
  <Main>
    <v-row class="padding-t-4 padding-b-8">
      <div style="width: 244px"></div>
      <CUDatePicker />
      <v-btn class="margin-l-3" outlined color="primary" small>Today</v-btn>
    </v-row>
    <v-row align="start" class="position-relative">
      <AvailabilityGridLines :vehicle-rows="vehicleKeyRows" />
      <AvailabilityVehicleList :vehicle-rows="vehicleKeyRows" />
      <!-- Inline styling needed to override default icon btn Vuetify settings -->
      <v-btn
        class="border-radius-2 background-primary margin-x-1"
        style="width: 24px; height: 28px"
        x-small
        icon
        color="primary"
        @click="shiftCalendarDisplayDate(-1)"
      >
        <CUIcon color="white" width="20px" height="20px">
          keyboard_arrow_left
        </CUIcon>
      </v-btn>
      <AvailabilityCalendar
        :show-date="calendarDisplayDateAsJS"
        :items="calendarItemsSortedByVehicles"
        :min-height="minHeight"
      />
      <v-btn
        class="border-radius-2 background-primary margin-x-1"
        style="width: 24px; height: 28px"
        x-small
        icon
        color="primary"
        @click="shiftCalendarDisplayDate(1)"
      >
        <CUIcon color="white" width="20px" height="20px">
          keyboard_arrow_right
        </CUIcon>
      </v-btn>
    </v-row>
  </Main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import availability from '@/services/availability'
import dayjs from 'dayjs'
import {
  AvailabilityGetRequest,
  AvailabilityBlock,
  VehicleBlockItem,
  VehicleKeyRow,
  UnassignedVehicle,
} from '@/models/dto/Availability'
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue'
import { convertReservationToAvailabilityBlock } from '@/utils/reservation'
import deepClone from '@/utils/deepClone'
import IntervalTree from '@flatten-js/interval-tree'
import {
  sortAvailabilityBlocksByVehicle,
  AVAILABILITY_ROW_HEIGHT,
} from '@/utils/availability'
import AvailabilityVehicleList from '@/components/AvailabilityVehicleList.vue'
import { Vehicle } from '@/models/dto'
import vehicle from '@/services/vehicle'
import AvailabilityGridLines from '@/components/AvailabilityGridLines.vue'

@Component({
  components: {
    Main,
    AvailabilityCalendar,
    AvailabilityVehicleList,
    AvailabilityGridLines,
  },
})
export default class Availability extends Vue {
  loadedReservations: Record<number, AvailabilityBlock> = {}

  reservations: AvailabilityBlock[] = []
  calendarDisplayDate = dayjs()
  loadedDateIntervals = new IntervalTree()
  vehicles: Vehicle[] = []

  get calendarDisplayDateAsJS(): Date {
    return this.calendarDisplayDate.toDate()
  }

  get calendarDisplayDateMonth(): string {
    return this.calendarDisplayDate.format()
  }

  // Date of the first day of the week
  get startOfWeek(): dayjs.Dayjs {
    return this.calendarDisplayDate.startOf('week')
  }

  get endOfWeek(): dayjs.Dayjs {
    return this.calendarDisplayDate.endOf('week')
  }

  // Given the whole array of loaded reservations, and the beginning/end of
  // the current week view, return an array of all reservations
  get displayedReservations(): AvailabilityBlock[] {
    const displayedReservations = []
    const reservationsList = Object.values(this.loadedReservations)
    for (const reservation of reservationsList) {
      const startDate = dayjs(reservation.startDate)
      const endDate = dayjs(reservation.endDate)

      if (
        this.startOfWeek.isSameOrBefore(startDate, 'day') &&
        this.endOfWeek.isSameOrAfter(startDate, 'day')
      ) {
        displayedReservations.push(reservation)
      } else if (
        this.startOfWeek.isSameOrBefore(endDate, 'day') &&
        this.endOfWeek.isSameOrAfter(endDate, 'day')
      ) {
        displayedReservations.push(reservation)
      } else if (
        startDate.isBefore(this.startOfWeek) &&
        endDate.isAfter(this.endOfWeek)
      ) {
        displayedReservations.push(reservation)
      }
    }
    return displayedReservations
  }

  // Rows for the vehicle sidebar + grid lines
  // Get an array of vehicle objects + how tall that row should be
  get vehicleKeyRows(): any {
    const vehicles: Vehicle[] = deepClone(this.vehicles)
    const sortedByVehicle = sortAvailabilityBlocksByVehicle(
      this.displayedReservations
    )

    const vehicleKeyRows: VehicleKeyRow[] = []
    let distanceFromTop = 0

    vehicles.forEach((vehicle) => {
      let newVehicleKeyRow: VehicleKeyRow = {
        rowHeight: AVAILABILITY_ROW_HEIGHT,
        vehicle: vehicle,
        distanceFromTop,
      }

      if (sortedByVehicle[vehicle.vehicleId]) {
        const heightOfRow =
          sortedByVehicle[vehicle.vehicleId].blocks.length *
          AVAILABILITY_ROW_HEIGHT
        newVehicleKeyRow.rowHeight = heightOfRow
        distanceFromTop += heightOfRow
      } else {
        distanceFromTop += AVAILABILITY_ROW_HEIGHT
      }

      vehicleKeyRows.push(newVehicleKeyRow)
    })

    const unassignedVehicle: VehicleKeyRow = {
      vehicle: {
        vehicleName: 'Unassigned',
        vehicleId: -1,
      },
      rowHeight: AVAILABILITY_ROW_HEIGHT,
      distanceFromTop,
    }

    if (sortedByVehicle[-1]) {
      unassignedVehicle.rowHeight =
        sortedByVehicle[-1].blocks.length * AVAILABILITY_ROW_HEIGHT
    }

    vehicleKeyRows.push(unassignedVehicle)

    return vehicleKeyRows
  }

  get calendarItemsSortedByVehicles(): AvailabilityBlock[] {
    let calendarItems = []

    const reduceFn = (newObj: Record<number, number>, row: VehicleKeyRow) => {
      newObj[row.vehicle.vehicleId] = row.distanceFromTop
      return newObj
    }
    const vehicleIdMap = this.vehicleKeyRows.reduce(reduceFn, {})

    const sortedByVehicle = sortAvailabilityBlocksByVehicle(
      this.displayedReservations
    )

    Object.entries(sortedByVehicle).map(([key, val]) => {
      let startingHeight = vehicleIdMap[key]
      const newBlocks = val.blocks.map(
        (block: AvailabilityBlock, index: number) => {
          block.top = startingHeight + index * AVAILABILITY_ROW_HEIGHT
          return block
        }
      )

      calendarItems = calendarItems.concat(newBlocks)
    })

    return calendarItems
  }

  // Get the starting height of the last row, and add the height of that row
  // to get the min heihgt the calendar should show.
  get minHeight(): number {
    const lastRow = this.vehicleKeyRows[this.vehicleKeyRows.length - 1]
    const { distanceFromTop, rowHeight } = lastRow
    return distanceFromTop + rowHeight
  }

  @Watch('calendarDisplayDate')
  onCalendarDisplayDateChange() {
    const startDate = this.startOfWeek.valueOf()
    const endDate = this.endOfWeek.valueOf()

    // Each interval will be in increments of weeks for now,
    // so we can assume any intersection is a full intersection
    // This will change if we start supporting searching for dates
    // in non-weekly intervals
    const dataIsLoadedForNewInterval = this.loadedDateIntervals.intersect_any([
      startDate,
      endDate,
    ])
    if (!dataIsLoadedForNewInterval) {
      this.getDispatchDataForDates(
        this.startOfWeek.format('YYYY-MM-DD'),
        this.endOfWeek.format('YYYY-MM-DD')
      )
    }
  }

  @Watch('loadedReservations', { immediate: true, deep: true })
  onLoadedReservationsChange(
    newReservations: Record<number, AvailabilityBlock>
  ): void {
    this.reservations = Object.values(newReservations)
  }

  async mounted(): Promise<void> {
    this.getVehicles()
    this.getDispatchDataForDates(
      dayjs().startOf('week').add(-1, 'week').format('YYYY-MM-DD'),
      dayjs().startOf('week').add(1, 'week').format('YYYY-MM-DD')
    )
  }

  async getDispatchDataForDates(
    startDatetime: string,
    endDatetime: string
  ): Promise<void> {
    const dates: AvailabilityGetRequest = { startDatetime, endDatetime }
    const res = await availability.getData(dates)

    for (const reservation of res.data.reservations) {
      const availabilityBlock =
        convertReservationToAvailabilityBlock(reservation)
      this.$set(
        this.loadedReservations,
        availabilityBlock.reservationId,
        deepClone(availabilityBlock)
      )
    }

    const startTime = dayjs(dates.startDatetime).valueOf()
    const endTime = dayjs(dates.endDatetime).valueOf()
    this.loadedDateIntervals.insert(
      [startTime, endTime],
      dayjs(startTime).format('YYYY-MM-DD')
    )
  }

  shiftCalendarDisplayDate(numWeeks: number): void {
    this.calendarDisplayDate = this.calendarDisplayDate.add(numWeeks, 'week')
  }

  async getVehicles(): Promise<void> {
    const vehiclesListRes = await vehicle.tableView({ pageSize: -1, page: 1 })
    this.vehicles = vehiclesListRes.data.resultList
  }
}
</script>
