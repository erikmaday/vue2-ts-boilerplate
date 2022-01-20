<template>
  <v-container>
    <v-row class="align-center">
      <h3
        class="col shrink white-space-nowrap font-book font-weight-400 font-20"
      >
        Your Bookings
      </h3>
      <v-spacer />
      <CUSkeletonLoader
        v-if="showCountLoaders"
        type="detail-text"
        width="160px"
        classes="col col-auto"
      />
      <router-link
        v-else
        class="col shrink white-space-nowrap text-primary font-14 font-medium text-decoration-underline cursor-pointer"
        :to="{ name: 'bookings' }"
      >
        All Your Bookings ({{ bookingsCount }})
      </router-link>
    </v-row>
    <v-row>
      <v-col v-if="showCountLoaders" cols="12">
        <CUSkeletonLoader
          height="32px"
          width="120px"
          v-for="chipIndex in Object.values(chips).length"
          type="chip"
          classes="d-inline-flex margin-r-2 cursor-pointer"
          :key="`booking-filter-skeleton-loader-${chipIndex}`"
          style="margin-bottom: 1px"
        />
      </v-col>
      <v-col v-else cols="12">
        <v-chip
          v-for="(filter, filterIndex) in Object.values(chips)"
          :color="filter.active ? 'primary' : 'gray-border'"
          :text-color="filter.active ? 'primary' : 'black'"
          outlined
          class="margin-r-2 cursor-pointer margin-b-2"
          :key="`booking-filter-${filterIndex}`"
          @click="filter.active = !filter.active"
        >
          {{ filter.label }}
          ({{ filter.count }})
        </v-chip>
      </v-col>
    </v-row>
    <v-row v-if="showCardLoaders">
      <v-col
        v-for="bookingCardSkeletonIndex in skeletonCardCount"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        :key="`booking-card-skeleton-${bookingCardSkeletonIndex}`"
      >
        <BookingCardSkeletonLoader />
      </v-col>
    </v-row>
    <v-row v-else-if="reservationsToDisplay.length">
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
    <TodayNotFound v-else message="No bookings found" icon="event_busy" />
    <v-row class="justify-center margin-x-0 margin-b-0 margin-t-3">
      <PaginationSkeletonLoader v-if="showCardLoaders" />
      <Pagination v-else v-model="pagination" :items="reservations" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import BookingCard from '@/components/BookingCard.vue'
import BookingCardSkeletonLoader from '@/components/BookingCardSkeletonLoader.vue'
import Pagination from '@/components/Pagination.vue'
import PaginationSkeletonLoader from '@/components/PaginationSkeletonLoader.vue'
import TodayNotFound from '@/components/TodayNotFound.vue'

import { Reservation } from '@/models/dto'
import reservation from '@/services/reservation'

import { filter } from '@/utils/filter'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import reservationFilters from '@/data/reservationFilters'
import { TodayFilterChip, TodayChipFilterState } from '@/models/TableView'
import deepClone from '@/utils/deepClone'
import app from '@/store/modules/app'

const MAX_RESULTS = -1
@Component({
  components: {
    BookingCard,
    TodayNotFound,
    Pagination,
    BookingCardSkeletonLoader,
    PaginationSkeletonLoader,
  },
})
export default class TodayBookings extends Vue {
  reservations: Reservation[] = []
  bookingsCount: number | null = null

  params = {
    pageSize: MAX_RESULTS,
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

  cardsLoading = false
  countsLoading = false

  get skeletonCardCount(): number {
    if (this.reservationsToDisplay.length) {
      return this.reservationsToDisplay.length
    }
    return this.pagination.pageSize
  }

  get showCardLoaders(): boolean {
    return (this.cardsLoading || this.countsLoading) && app.getAreLoadersEnabled
  }

  get showCountLoaders(): boolean {
    return this.countsLoading && app.getAreLoadersEnabled
  }

  get reservationsToDisplay(): Reservation[] {
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.pageSize
    return this.reservations.slice(
      startIndex,
      startIndex + this.pagination.pageSize
    )
  }

  chips: { [key: string]: TodayFilterChip } = {
    startingSoon: {
      label: 'Starting Soon',
      count: 0,
      buildFilters: (
        filterState: TodayChipFilterState = this.buildBaseFilters()
      ) => this.buildStartingSoonFilters(filterState),
      active: true,
    },
    bookedToday: {
      label: 'Booked Today',
      count: 0,
      buildFilters: (
        filterState: TodayChipFilterState = this.buildBaseFilters()
      ) => this.buildBookedTodayFilters(filterState),
      active: false,
    },
    needsAcceptance: {
      label: 'Needs Acceptance',
      count: 0,
      buildFilters: (
        filterState: TodayChipFilterState = this.buildBaseFilters()
      ) => this.buildNeedsAcceptanceFilters(filterState),
      active: false,
    },
    needsAssignment: {
      label: 'Needs Assignment',
      count: 0,
      buildFilters: (
        filterState: TodayChipFilterState = this.buildBaseFilters()
      ) => this.buildNeedsAssignmentFilters(filterState),
      active: false,
    },
    inProgress: {
      label: 'In Progress',
      count: 0,
      buildFilters: (
        filterState: TodayChipFilterState = this.buildBaseFilters()
      ) => this.buildIsInProgressFilters(filterState),
      active: false,
    },
    finished: {
      label: 'Finished',
      count: 0,
      buildFilters: (
        filterState: TodayChipFilterState = this.buildBaseFilters()
      ) => this.buildIsFinishedFilters(filterState),
      active: false,
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any = null

  @Watch('chips', { deep: true })
  onChipsChanged(): void {
    const { filters } = this.buildFilters()
    this.getBookings(filters)
  }

  get currentTimestamp(): dayjs.Dayjs {
    dayjs.extend(utc)
    return dayjs().utc()
  }

  mounted(): void {
    this.cardsLoading = true
    this.getAllCounts()
    const { filters } = this.buildFilters()
    this.getBookings(filters)
  }

  async getBookings(filters: any): Promise<void> {
    this.cardsLoading = true
    this.params.filters = filters.asQueryParams()
    const reservationResponse = await reservation.tableView(this.params)
    this.reservations = reservationResponse.data.resultList
    this.cardsLoading = false
  }

  async getAllCounts(): Promise<void> {
    this.countsLoading = true
    this.getAllBookingsCount()
    for (const chip of Object.values(this.chips)) {
      await this.getFilterChipCount(chip)
    }
    this.countsLoading = false
  }

  async getFilterChipCount(chip: TodayFilterChip): Promise<void> {
    const result = chip.buildFilters()

    const response = await reservation.tableView({
      page: 1,
      pageSize: 0,
      sorts: null,
      filters: result.filters.asQueryParams(),
    })
    chip.count = response.data.count
  }

  async getAllBookingsCount(): Promise<void> {
    const { filters } = this.buildBaseFilters()
    const response = await reservation.tableView({
      page: 1,
      pageSize: 0,
      sorts: null,
      filters: filters.asQueryParams(),
    })
    this.bookingsCount = response.data.count
  }

  buildBaseFilters(): TodayChipFilterState {
    const filters = filter()
    const parentFilter = filters.createParent('and')
    const parentReferralFilter = filters.createParent('and', parentFilter)
    const filterIsReferral = reservationFilters.isReferral
    filterIsReferral.column._t_id = uuidv4()
    filters.add(parentReferralFilter, filterIsReferral)
    const filterParentOr = filters.createParent('or', parentFilter)

    return { filters, filterParentOr }
  }

  buildNoChipsSelectedFilters(): TodayChipFilterState {
    const filters = filter()
    const parentFilter = filters.createParent('and')
    // const parentReferralFilter = filters.createParent('and', parentFilter)

    const filterIsReferral = deepClone(reservationFilters.isReferral)
    const filterIsStartDateInFuture = deepClone(
      reservationFilters.isStartDateInFuture
    )
    const filterIsStartDateLessThanAWeekAway = deepClone(
      reservationFilters.isStartDateLessThanAWeekAway
    )

    filterIsReferral.column._t_id = uuidv4()
    filterIsStartDateInFuture.column._t_id = uuidv4()
    filterIsStartDateLessThanAWeekAway.column._t_id = uuidv4()

    filters.add(parentFilter, filterIsStartDateInFuture)
    filters.add(parentFilter, filterIsStartDateLessThanAWeekAway)
    filters.add(parentFilter, filterIsReferral)

    return { filters, filterParentOr: null }
  }

  buildStartingSoonFilters(
    filterState: TodayChipFilterState
  ): TodayChipFilterState {
    const { filters, filterParentOr } = filterState

    const filterIsStartDateInFuture = deepClone(
      reservationFilters.isStartDateInFuture
    )
    const filterIsStartDateLessThanADayAway = deepClone(
      reservationFilters.isStartDateLessThanADayAway
    )

    filterIsStartDateLessThanADayAway.column._t_id = uuidv4()
    filterIsStartDateInFuture.column._t_id = uuidv4()

    const filterParent = filters.createParent('and', filterParentOr)
    filters.add(filterParent, filterIsStartDateInFuture)
    filters.add(filterParent, filterIsStartDateLessThanADayAway)

    return { filters, filterParentOr }
  }

  buildBookedTodayFilters(
    filterState: TodayChipFilterState
  ): TodayChipFilterState {
    const { filters, filterParentOr } = filterState

    const filterCreatedOnToday = deepClone(reservationFilters.createdOnToday)

    filterCreatedOnToday.column._t_id = uuidv4()

    const filterParent = filters.createParent('and', filterParentOr)
    filters.add(filterParent, filterCreatedOnToday)

    return { filters, filterParentOr }
  }

  buildNeedsAcceptanceFilters(
    filterState: TodayChipFilterState
  ): TodayChipFilterState {
    const { filters, filterParentOr } = filterState

    const filterIsReferral = deepClone(reservationFilters.isReferral)
    const filterIsOffered = deepClone(reservationFilters.isOffered)
    const filterIsStartDateInFuture = deepClone(
      reservationFilters.isStartDateInFuture
    )
    const filterIsStartDateLessThanAWeekAway = deepClone(
      reservationFilters.isStartDateLessThanAWeekAway
    )
    const filterWasOfferedInLastDay = deepClone(
      reservationFilters.wasOfferedInLastDay
    )

    filterIsOffered.column._t_id = uuidv4()
    filterIsReferral.column._t_id = uuidv4()
    filterIsStartDateInFuture.column._t_id = uuidv4()
    filterIsStartDateLessThanAWeekAway.column._t_id = uuidv4()
    filterWasOfferedInLastDay.column._t_id = uuidv4()

    const filterParent = filters.createParent('and', filterParentOr)
    filters.add(filterParent, filterIsReferral)
    filters.add(filterParent, filterIsOffered)

    const filterAcceptanceOr = filters.createParent('or', filterParent)
    filters.add(filterAcceptanceOr, filterWasOfferedInLastDay)
    const filterStartDateRange = filters.createParent('and', filterAcceptanceOr)
    filters.add(filterStartDateRange, filterIsStartDateInFuture)
    filters.add(filterStartDateRange, filterIsStartDateLessThanAWeekAway)

    return { filters, filterParentOr }
  }

  buildNeedsAssignmentFilters(
    filterState: TodayChipFilterState
  ): TodayChipFilterState {
    const { filters, filterParentOr } = filterState

    const filterIsReferral = deepClone(reservationFilters.isReferral)
    const filterIsStartDateInFuture = deepClone(
      reservationFilters.isStartDateInFuture
    )
    const filterIsStartDateLessThanAWeekAway = deepClone(
      reservationFilters.isStartDateLessThanAWeekAway
    )
    const filterIsAccepted = deepClone(reservationFilters.isAccepted)
    const filterNeedsDrivers = deepClone(
      reservationFilters.needsDriverAssignment
    )
    const filterNeedsVehicles = deepClone(
      reservationFilters.needsVehicleAssignment
    )

    filterIsReferral.column._t_id = uuidv4()
    filterIsStartDateInFuture.column._t_id = uuidv4()
    filterIsStartDateLessThanAWeekAway.column._t_id = uuidv4()
    filterIsAccepted.column._t_id = uuidv4()
    filterNeedsDrivers.column._t_id = uuidv4()
    filterNeedsVehicles.column._t_id = uuidv4()

    const filterParentAnd = filters.createParent('and', filterParentOr)
    filters.add(filterParentAnd, filterIsReferral)
    filters.add(filterParentAnd, filterIsAccepted)
    filters.add(filterParentAnd, filterIsStartDateInFuture)
    filters.add(filterParentAnd, filterIsStartDateLessThanAWeekAway)
    const filterNeedsAssignments = filters.createParent('or', filterParentAnd)
    filters.add(filterNeedsAssignments, filterNeedsDrivers)
    filters.add(filterNeedsAssignments, filterNeedsVehicles)

    return { filters, filterParentOr }
  }

  buildIsInProgressFilters(
    filterState: TodayChipFilterState
  ): TodayChipFilterState {
    const { filters, filterParentOr } = filterState

    const filterIsReferral = deepClone(reservationFilters.isReferral)
    const filterIsInProgress = deepClone(reservationFilters.isInProgress)

    filterIsReferral.column._t_id = uuidv4()
    filterIsInProgress.column._t_id = uuidv4()

    const filterParent = filters.createParent('and', filterParentOr)
    filters.add(filterParent, filterIsReferral)
    filters.add(filterParent, filterIsInProgress)

    return { filters, filterParentOr }
  }

  buildIsFinishedFilters(
    filterState: TodayChipFilterState
  ): TodayChipFilterState {
    const { filters, filterParentOr } = filterState

    const filterIsReferral = deepClone(reservationFilters.isReferral)
    const filterIsFinished = deepClone(reservationFilters.isFinished)
    const filterIsStartDateLessThanAThreeDaysAgo = deepClone(
      reservationFilters.isStartDateLessThanAThreeDaysAgo
    )

    filterIsReferral.column._t_id = uuidv4()
    filterIsFinished.column._t_id = uuidv4()
    filterIsStartDateLessThanAThreeDaysAgo.column._t_id = uuidv4()

    const filterParent = filters.createParent('and', filterParentOr)
    filters.add(filterParent, filterIsReferral)
    filters.add(filterParent, filterIsFinished)
    filters.add(filterParent, filterIsStartDateLessThanAThreeDaysAgo)

    return { filters, filterParentOr }
  }

  buildFilters(): TodayChipFilterState {
    let filters, filterParentOr
    const activeChips = Object.values(this.chips).filter((chip) => chip.active)
    if (activeChips.length) {
      const result = this.buildBaseFilters()
      filters = result.filters
      filterParentOr = result.filterParentOr
      for (const chip of activeChips) {
        if (chip.active) {
          const result = chip.buildFilters({ filters, filterParentOr })
          filters = result.filters
          filterParentOr = result.filterParentOr
        }
      }
    } else {
      const result = this.buildNoChipsSelectedFilters()
      filters = result.filters
      filterParentOr = result.filterParentOr
    }

    return { filters, filterParentOr }
  }
}
</script>
