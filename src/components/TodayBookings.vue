<template>
  <v-container>
    <v-row>
      <h3
        class="col shrink white-space-nowrap font-book font-weight-400 font-20"
      >
        Your Bookings
      </h3>
      <v-spacer />
      <p
        class="
          col
          shrink
          white-space-nowrap
          text-primary
          font-14 font-medium
          text-decoration-underline
          cursor-pointer
        "
      >
        All Your Bookings ({{ reservationCount }})
      </p>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-chip
          v-for="(filter, filterIndex) in bookingFilterChips"
          :color="filter.active ? 'primary' : 'gray-border'"
          :text-color="filter.active ? 'primary' : 'black'"
          outlined
          class="margin-r-2 cursor-pointer margin-b-2"
          :key="`booking-filter-${filterIndex}`"
          @click="handleFilterClick(filter)"
        >
          {{ filter.label }}
          <!-- ADD BACK IN WHEN WE DETERMINE THE BEST WAY TO PULL THESE COUNTS
            ({{ filter.count }})
          -->
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(reservation, reservationIndex) in reservationsToDisplay"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        :key="`reservation-${reservation.childReservationId}-${reservationIndex}`"
      >
        <BookingCard :reservation="reservation" />
      </v-col>
    </v-row>
    <v-row class="justify-center margin-x-0 margin-b-0 margin-t-3">
      <Pagination v-model="pagination" :items="reservations" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import BookingCard from '@/components/BookingCard.vue'
import Pagination from '@/components/Pagination.vue'

import { Reservation } from '@/models/dto'
import reservation from '@/services/reservation'

import { filter } from '@/utils/filter'
import deepClone from '@/utils/deepClone'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import reservationFilters from '@/data/reservationFilters'
import { TableViewFilterChip } from '@/models/TableView'

@Component({
  components: {
    BookingCard,
    Pagination,
  },
})
export default class TodayBookings extends Vue {
  // TODO: FIGURE OUT HOW WE CAN DISPLAY THE NUMBER NEXT TO EACH ONE WITHOUT CALLING THE ENDPOINT FOR THEM
  reservations: Reservation[] = []
  reservationCount = 0

  params = {
    pageSize: -1,
    page: 1,
    filters: null,
    sorts: null,
  }

  pagination = {
    pageSize: 4,
    currentPage: 1,
    breakpointSizes: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 4,
    },
  }

  get reservationsToDisplay(): Reservation[] {
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.pageSize
    return this.reservations.slice(
      startIndex,
      startIndex + this.pagination.pageSize
    )
  }

  bookingFilterChips: TableViewFilterChip[] = [
    {
      label: 'Starting Soon',
      count: 0,
      filter: [
        reservationFilters.isStartDateInFuture,
        reservationFilters.isStartDateLessThanADayAway,
        reservationFilters.isUpcoming,
      ],
      active: false,
    },
    {
      label: 'Needs Acceptance',
      count: 0,
      filter: [reservationFilters.isNotAccepted],
      active: false,
    },
    {
      label: 'Needs Assignment',
      count: 0,
      filter: [
        reservationFilters.needsDriverAssignment,
        reservationFilters.needsVehicleAssignment,
        reservationFilters.isAccepted,
      ],
      active: false,
    },
    {
      label: 'In Progress',
      count: 0,
      filter: [reservationFilters.isInProgress],
      active: false,
    },
    {
      label: 'Finished',
      count: 0,
      filter: [reservationFilters.isFinished],
      active: false,
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any = null

  @Watch('params', { deep: true })
  onParamsChanged(): void {
    this.getBookings()
  }

  get currentTimestamp(): dayjs.Dayjs {
    dayjs.extend(utc)
    return dayjs().utc()
  }

  async mounted(): Promise<void> {
    this.establishFilters()
    this.getBookings(true)
  }

  async getBookings(setCount = false): Promise<void> {
    this.params.filters = this.filters.asQueryParams()
    const reservationResponse = await reservation.tableView(this.params)
    this.reservations = reservationResponse.data.resultList
    if (setCount) {
      this.reservationCount = reservationResponse.data.count
    }
  }

  establishFilters(): void {
    const filterIsReferral = reservationFilters.isReferral
    filterIsReferral.column._t_id = uuidv4()

    const filterIsStartDateInFuture = deepClone(
      reservationFilters.isStartDateInFuture
    )
    filterIsStartDateInFuture.column._t_id = uuidv4()

    const filterIsInProgress = deepClone(reservationFilters.isInProgress)
    filterIsInProgress.column._t_id = uuidv4()

    const filterInstance = filter()
    const filterParentAnd = filterInstance.createParent('and')
    const filterParentReferral = filterInstance.createParent(
      'and',
      filterParentAnd
    )
    filterInstance.add(filterParentReferral, filterIsReferral)
    const filterUpcomingOrInProgress = filterInstance.createParent(
      'or',
      filterParentAnd
    )
    filterInstance.add(filterUpcomingOrInProgress, filterIsStartDateInFuture)
    filterInstance.add(filterUpcomingOrInProgress, filterIsInProgress)

    this.filters = filterInstance
  }

  handleFilterClick(filterChip: TableViewFilterChip): void {
    filterChip.active = !filterChip.active
    this.establishFilters()
    const filterInstance = this.filters
    const filterParentAnd = filterInstance.createParent('and')
    const filterParentOrAdditionalFilters = filterInstance.createParent(
      'or',
      filterParentAnd
    )

    for (const filterItem of this.bookingFilterChips) {
      if (filterItem.active) {
        const filterParentFilterChipGroup = filterInstance.createParent(
          'and',
          filterParentOrAdditionalFilters
        )
        for (const filter of filterItem.filter) {
          filterInstance.add(filterParentFilterChipGroup, filter)
        }
      }
    }
    this.filters = filterInstance
    this.params.filters = this.filters.asQueryParams()
  }
}
</script>
