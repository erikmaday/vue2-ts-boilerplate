<template>
  <Main>
    <v-row
      style="padding-left: 179px"
      justify="space-between"
      class="padding-t-4 padding-b-8"
    >
      <span class="d-flex">
        <CUDatePicker
          :value="datePickerDate"
          @input="updateDatePickerDate"
          hide-details
          dense
          readonly
        />
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
        <CUIcon color="white" class="margin-r-2">filter</CUIcon>
        Filter
      </v-btn>
    </v-row>
    <v-row align="start" class="position-relative">
      <AvailabilityGridLines
        :is-vehicle-display="isVehicleDisplay"
        :vehicle-rows="vehicleKeyRows"
        :driver-rows="driverKeyRows"
      />
      <AvailabilityKeyList
        :vehicle-rows="vehicleKeyRows"
        :driver-rows="driverKeyRows"
        :is-vehicle-display="isVehicleDisplay"
        @input:vehicle-display-select="(e) => (isVehicleDisplay = e)"
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
          class="padding-y-1"
          :multiple="true"
          display-select-all
          :aggregate-selection-index="4"
          label="Vehicle Type"
          :items="vehicleTypes"
          item-text="label"
          item-value="id"
          hide-details
        ></CUSelect>
        <CUSelect
          v-model="filters.vehicles"
          class="padding-y-1"
          :multiple="true"
          display-select-all
          :aggregate-selection-index="1"
          label="Vehicles"
          :items="vehicles"
          item-text="vehicleName"
          item-value="vehicleId"
          hide-details
        />
        <CUSelect
          v-model="filters.drivers"
          class="padding-y-1"
          :multiple="true"
          display-select-all
          :aggregate-selection-index="2"
          label="Drivers"
          :items="drivers"
          item-text="fullName"
          item-value="userId"
          hide-details
        />
      </template>
      <template #actions>
        <v-spacer />
        <v-btn small color="error" text @click="resetFilters">Reset</v-btn>
        <v-btn small color="primary" @click="applyFilters">Filter</v-btn>
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
  VehicleKeyRow,
  DriverKeyRow,
} from '@/models/dto/Availability'
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue'
import { convertReservationToAvailabilityBlock } from '@/utils/availability'
import deepClone from '@/utils/deepClone'
import IntervalTree from '@flatten-js/interval-tree'
import {
  sortAvailabilityBlocksByVehicle,
  sortAvailabilityBlocksByDriver,
  AVAILABILITY_ROW_HEIGHT,
} from '@/utils/availability'
import AvailabilityKeyList from '@/components/AvailabilityKeyList.vue'
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
    AvailabilityKeyList,
    AvailabilityGridLines,
  },
})
export default class Availability extends Vue {
  isDialogOpen = false
  isVehicleDisplay = true

  loadedReservations: Record<number, AvailabilityBlock> = {}
  calendarDisplayDate = dayjs()
  loadedDateIntervals = new IntervalTree()

  vehicles: Vehicle[] = []
  drivers: Driver[] = []
  vehicleTypes: VehicleType[] = []

  displayedDrivers: Driver[] = []
  displayedVehicles: Vehicle[] = []
  datePickerDate: string = dayjs().format('YYYY-MM-DD')
  filters = {
    vehicleTypes: [],
    vehicles: [],
    drivers: [],
  }

  // Accepts a date in the format of `MM/DD/YYYY`
  // and sets the currently displayed date on the
  // calendar to this date
  updateDatePickerDate(date: string): void {
    this.calendarDisplayDate = dayjs(date, 'YYYY-MM-DD')
  }

  get calendarDisplayDateAsJS(): Date {
    return this.calendarDisplayDate.toDate()
  }

  get calendarDisplayDateMonth(): string {
    return this.calendarDisplayDate.format()
  }

  get startOfWeek(): dayjs.Dayjs {
    return this.calendarDisplayDate
  }

  get endOfWeek(): dayjs.Dayjs {
    return this.calendarDisplayDate.add(7, 'day')
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
  get vehicleKeyRows(): VehicleKeyRow[] {
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
        vehicleName: 'Needs Assignment',
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

  // Computed for the driver sidebar
  // Returns a list of driver objects + how tall that row
  // should be
  get driverKeyRows(): DriverKeyRow[] {
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
        firstName: 'Needs',
        lastName: 'Assignment',
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

  // For each displayed calendar item, find its starting height
  // on the calendar based on the vehicleKeyRows
  get calendarItemsSortedByVehicles(): AvailabilityBlock[] {
    let calendarItems = []

    const reduceFn = (newObj: Record<number, number>, row: VehicleKeyRow) => {
      newObj[row.vehicle.vehicleId] = row.distanceFromTop
      return newObj
    }
    const vehicleIdToStartingHeight = this.vehicleKeyRows.reduce(reduceFn, {})

    const sortedByVehicle = sortAvailabilityBlocksByVehicle(
      this.displayedReservations
    )

    Object.entries(sortedByVehicle)
      .filter(([vehicleId]) => {
        if (vehicleIdToStartingHeight[vehicleId] != null) {
          return true
        }
        return false
      })
      .map(([vehicleId, vehicleInfo]) => {
        let startingHeight
        if (vehicleIdToStartingHeight[vehicleId]) {
          startingHeight = vehicleIdToStartingHeight[vehicleId]
        } else {
          startingHeight = vehicleIdToStartingHeight[-1]
        }
        const newBlocks = vehicleInfo.blocks.map(
          (block: AvailabilityBlock, index: number) => {
            block.top = startingHeight + index * AVAILABILITY_ROW_HEIGHT
            return block
          }
        )

        calendarItems = calendarItems.concat(newBlocks)
      })

    return calendarItems
  }

  // For each displayed calendar item, find its starting height
  // on the calendar based on the driverKeyRows
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

    Object.entries(sortedByDriver)
      .filter(([id]) => {
        if (driverIdMap[id] != null) {
          return true
        }
        return false
      })
      .map(([key, val]) => {
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
  // Minimum height of the entire calendar
  // Get the starting height of the last row, and add its height
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

  // When the displayed date changes, check if we need to
  // load more reservations by checking the date intervals
  // we've already loaded in our interval tree
  @Watch('calendarDisplayDate')
  onCalendarDisplayDateChange(newDate: dayjs.Dayjs): void {
    this.datePickerDate = newDate.format('MM/DD/YYYY')
    const startDate = this.startOfWeek.valueOf()

    // Each interval will be in increments of weeks for now,
    // so we can assume any intersection is a full intersection
    // This will change if we start supporting searching for dates
    // in non-weekly intervals
    const dataIsLoadedForNewInterval = this.loadedDateIntervals.intersect_any([
      startDate,
      startDate,
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

  shiftCalendarDisplayDate(numWeeks: number): void {
    this.calendarDisplayDate = this.calendarDisplayDate.add(numWeeks, 'week')
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

  // Load reservations for dates, and add them to the object that stores
  // reservations by id (prevents duplicates).
  // Add the loaded dates to the interval tree
  async getDispatchDataForDates(
    startDatetime: string,
    endDatetime: string
  ): Promise<void> {
    const dates: AvailabilityGetRequest = { startDatetime, endDatetime }
    const res = await availability.getData(dates, true)

    for (const reservation of res.data.reservations) {
      const availabilityBlock =
        convertReservationToAvailabilityBlock(reservation)
      this.$set(
        this.loadedReservations,
        availabilityBlock.managedReservationId,
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

  applyFilters(): void {
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
    this.displayedDrivers = [...displayedDrivers]
    this.displayedVehicles = [...displayedVehicles]

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
      vehicles: deepClone(this.vehicles).map(({ vehicleId }) => vehicleId),
      drivers: deepClone(this.drivers).map(({ userId }) => userId),
    }
  }

  async getVehicles(): Promise<void> {
    const vehiclesListRes = await vehicle.tableView({ pageSize: -1, page: 1 })
    this.vehicles = deepClone(vehiclesListRes.data.resultList)
    this.displayedVehicles = deepClone(vehiclesListRes.data.resultList)
    this.initializeFilters()
  }

  async getDrivers(): Promise<void> {
    const driversListRes = await driver.tableView({ pageSize: -1, page: 1 })
    const mappedDrivers = driversListRes.data.resultList.map((d) => ({
      ...d,
      fullName: `${d.firstName} ${d.lastName}`,
    }))
    this.drivers = deepClone(mappedDrivers)
    this.displayedDrivers = deepClone(mappedDrivers)
    this.initializeFilters()
  }

  async getVehicleTypes(): Promise<void> {
    const res = await vehicleType.vehicleTypeTableView({
      pageSize: -1,
      page: 1,
    })
    this.vehicleTypes = res.data.resultList
    this.initializeFilters()
  }
}
</script>
