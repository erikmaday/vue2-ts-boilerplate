<template>
  <Main>
    <v-row style="padding-left: 215px;" justify="space-between" class="padding-t-4 padding-b-8">
      <span class="d-flex">
        <CUDatePicker :value="datePickerDate" @input="updateDatePickerDate" />
        <v-btn
          class="margin-l-3"
          outlined
          color="primary"
          small
          @click="setCalendarDisplayToToday"
        >
          Today
        </v-btn>
      </span>
      <v-btn color="primary" small @click="isDialogOpen = true">
        <CUIcon color="white" class="margin-r-2">
          filter
        </CUIcon>
        Filter
      </v-btn>
    </v-row>
    <v-row align="start" class="position-relative">
      <AvailabilityGridLines
        :is-vehicle-display="isVehicleDisplay"
        :vehicle-rows="vehicleKeyRows"
        :driver-rows="driverKeyRows"
      />
      <AvailabilityVehicleList
        :vehicle-rows="vehicleKeyRows"
        :driver-rows="driverKeyRows"
        :is-vehicle-display="isVehicleDisplay"
        @input:vehicle-display-select="e => isVehicleDisplay = e"
      />
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
        :items="
          isVehicleDisplay
            ? calendarItemsSortedByVehicles
            : calendarItemsSortedByDrivers
        "
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
    
    <CUModal v-model="isDialogOpen">
      <template #title>Filters</template>
      <template #text>
        <CUSelect
          v-model="filters.vehicleTypes"
          multiple
          :aggregate-selection-index="4"
          label="Vehicle Type"
          :items="vehicleTypes"
          item-text="label"
          item-value="id"
        >
          
        </CUSelect>
        <CUSelect
          v-model="filters.vehicles"
          multiple
          :aggregate-selection-index="1"
          label="Vehicles"
          :items="vehicles"
          item-text="vehicleName"
          item-value="vehicleId"
        />
        <CUSelect
          v-model="filters.drivers"
          multiple
          :aggregate-selection-index="2"
          label="Drivers"
          :items="drivers"
          item-text="fullName"
          item-value="userId"
        />
      </template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" outlined @click="resetFilters">
          Reset Filters
        </v-btn>
        <v-btn color="primary" @click="filterDriverAndVehicleKeys">
          Filter
        </v-btn>
        <v-spacer />
      </template>
    </CUModal>
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
  DriverKeyRow,
} from '@/models/dto/Availability'
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue'
import { convertReservationToAvailabilityBlock } from '@/utils/reservation'
import deepClone from '@/utils/deepClone'
import IntervalTree from '@flatten-js/interval-tree'
import {
  sortAvailabilityBlocksByVehicle,
  sortAvailabilityBlocksByDriver,
  AVAILABILITY_ROW_HEIGHT,
} from '@/utils/availability'
import AvailabilityVehicleList from '@/components/AvailabilityVehicleList.vue'
import { Vehicle, VehicleType } from '@/models/dto'
import vehicle from '@/services/vehicle'
import driver from '@/services/driver'
import AvailabilityGridLines from '@/components/AvailabilityGridLines.vue'
import { Driver } from '@/models/dto/Driver'
import vehicleType from '@/services/type'
@Component({
  components: {
    Main,
    AvailabilityCalendar,
    AvailabilityVehicleList,
    AvailabilityGridLines,
  },
})
export default class Availability extends Vue {
  isDialogOpen = false
  isVehicleDisplay = false

  loadedReservations: Record<number, AvailabilityBlock> = {}
  // reservations: AvailabilityBlock[] = []
  calendarDisplayDate = dayjs()
  loadedDateIntervals = new IntervalTree()

  vehicles: Vehicle[] = []
  drivers: Driver[] = []
  vehicleTypes: VehicleType[] = []

  displayedDrivers: Driver[] = []
  displayedVehicles: Vehicle[] = []
  datePickerDate: string = dayjs().format('MM/DD/YYYY')
  filters = {
    vehicleTypes: [],
    vehicles: [],
    drivers: [],
  }

  updateDatePickerDate(date) {
    this.calendarDisplayDate = dayjs(date, 'MM/DD/YYYY')
  }

  get calendarDisplayDateAsJS(): Date {
    return this.calendarDisplayDate.toDate()
  }

  get calendarDisplayDateAsLocalizedString(): string {
    return this.calendarDisplayDate.format('MM/DD/YYYY')
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
    const vehicles: Vehicle[] = deepClone(this.displayedVehicles)
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

  get driverKeyRows(): any {
    const drivers: Driver[] = deepClone(this.displayedDrivers)
    const sortedByDriver = sortAvailabilityBlocksByDriver(
      this.displayedReservations
    )
    const driverKeyRows: DriverKeyRow[] = []
    let distanceFromTop = 0

    drivers.forEach((driver) => {
      let newVehicleKeyRow: DriverKeyRow = {
        rowHeight: AVAILABILITY_ROW_HEIGHT,
        driver: driver,
        distanceFromTop,
      }

      if (sortedByDriver[driver.userId]) {
        const heightOfRow =
          sortedByDriver[driver.userId].blocks.length * AVAILABILITY_ROW_HEIGHT
        newVehicleKeyRow.rowHeight = heightOfRow
        distanceFromTop += heightOfRow
      } else {
        distanceFromTop += AVAILABILITY_ROW_HEIGHT
      }

      driverKeyRows.push(newVehicleKeyRow)
    })

    const unassignedDriver: DriverKeyRow = {
      driver: {
        firstName: 'Unassigned',
        lastName: '',
        userId: -1,
      },
      rowHeight: AVAILABILITY_ROW_HEIGHT,
      distanceFromTop,
    }

    if (sortedByDriver[-1]) {
      unassignedDriver.rowHeight =
        sortedByDriver[-1].blocks.length * AVAILABILITY_ROW_HEIGHT
    }

    driverKeyRows.push(unassignedDriver)

    return driverKeyRows
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

  get calendarItemsSortedByDrivers(): AvailabilityBlock[] {
    let calendarItems = []

    const reduceFn = (newObj: Record<number, number>, row: DriverKeyRow) => {
      newObj[row.driver.userId] = row.distanceFromTop
      return newObj
    }
    const driverIdMap = this.driverKeyRows.reduce(reduceFn, {})

    const sortedByDriver = sortAvailabilityBlocksByDriver(
      this.displayedReservations
    )

    Object.entries(sortedByDriver).map(([key, val]) => {
      let startingHeight = driverIdMap[key]
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
    let lastRow 
    if (this.isVehicleDisplay) {
      lastRow = this.vehicleKeyRows[this.vehicleKeyRows.length - 1]
    } else {
      lastRow = this.driverKeyRows[this.driverKeyRows.length - 1]
    }
    const { distanceFromTop, rowHeight } = lastRow
    return distanceFromTop + rowHeight
  }

  @Watch('calendarDisplayDate')
  onCalendarDisplayDateChange(newDate: dayjs.Dayjs) {
    this.datePickerDate = newDate.format('MM/DD/YYYY')
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

  setCalendarDisplayToToday(): void {
    this.calendarDisplayDate = dayjs()
  }

  async mounted(): Promise<void> {
    this.getDrivers()
    this.getVehicles()
    this.getVehicleTypes()
    this.initializeFilters()
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

  filterDriverAndVehicleKeys(): void {
    let displayedVehicles = deepClone(this.vehicles)
    let displayedDrivers = deepClone(this.drivers)

    displayedVehicles = this.vehicles
    if (this.filters.vehicleTypes.length) {
      displayedVehicles = displayedVehicles.filter((vehicle) => {
        return this.filters.vehicleTypes.includes(vehicle.vehicleTypeId)
      })
    }

    if (this.filters.vehicles.length) {
      displayedVehicles = displayedVehicles.filter((vehicle) => {
        return this.filters.vehicles.includes(vehicle.vehicleId)
      })
    }

    if (this.filters.drivers.length) {
      displayedDrivers = displayedDrivers.filter((driver) => {
        return this.filters.drivers.includes(driver.userId)
      })
    }
    // For some reason, these properties aren't reactive when updating the whole array with 
    // any iteration of this.displayedVehicles = displayedVehicles
    // Clear both arrays, then push all elements
    this.displayedVehicles.splice(0)
    this.displayedVehicles.push(...displayedVehicles)

    this.displayedDrivers.splice(0)
    this.displayedDrivers.push(...displayedDrivers)

    this.isDialogOpen = false
  }

  resetFilters(): void {
    this.initializeFilters()
    this.displayedDrivers = this.drivers
    this.displayedVehicles = this.vehicles

    this.isDialogOpen = false
  }

  initializeFilters(): void {
    this.filters = {
      vehicleTypes: this.vehicleTypes.map(({ id }) => id),
      vehicles: this.vehicles.map(({ vehicleId }) => vehicleId),
      drivers: this.drivers.map(({ userId }) => userId),
    }
  }

  shiftCalendarDisplayDate(numWeeks: number): void {
    this.calendarDisplayDate = this.calendarDisplayDate.add(numWeeks, 'week')
  }

  async getVehicles(): Promise<void> {
    const vehiclesListRes = await vehicle.tableView({ pageSize: -1, page: 1 })
    this.vehicles = deepClone(vehiclesListRes.data.resultList)
    this.displayedVehicles = deepClone(vehiclesListRes.data.resultList)
    this.initializeFilters()
  }

  async getDrivers(): Promise<void> {
    const driversListRes = await driver.tableView({ pageSize: -1, page: 1 })
    const mappedDrivers = driversListRes.data.resultList.map(d => ({...d, fullName: `${d.firstName} ${d.lastName}`}))
    this.drivers = deepClone(mappedDrivers)
    this.displayedDrivers = deepClone(mappedDrivers)
    this.initializeFilters()
  }

  async getVehicleTypes(): Promise<void> {
    const res = await vehicleType.vehicleTypeTableView({ pageSize: -1, page: 1 })
    this.vehicleTypes = res.data.resultList
    this.initializeFilters()
  }
}
</script>
