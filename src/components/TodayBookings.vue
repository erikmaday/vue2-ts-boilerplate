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
          v-for="(filter, filterIndex) in bookingFilters"
          :color="filter.active ? 'primary' : 'gray-border'"
          :text-color="filter.active ? 'primary' : 'black'"
          outlined
          class="margin-r-2 cursor-pointer margin-b-2"
          :key="`booking-filter-${filterIndex}`"
          @click="handleFilterClick(filter)"
        >
          {{ filter.label }} ({{ filter.count }})
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
      <Pagination
        v-model="pagination"
        :breakpoint-sizes="pageSizeByBreakpoint"
        :items="reservations"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import BookingCard from '@/components/BookingCard.vue'
import Pagination from '@/components/Pagination.vue'

import { filter } from '@/utils/filter'
import {
  ReservationType,
  ReferralStatus,
  ReservationStatus,
} from '@/utils/enum'
import { Reservation, TableViewFilterChip } from '@/models/dto'
import reservation from '@/services/reservation'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
    pageSize: 24, // TODO: remove this and only pull in inprogress or future trips
    page: 1,
    filters: null,
    sorts: null,
  }

  pagination = {
    pageSize: 4,
    currentPage: 1,
  }

  pageSizeByBreakpoint = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  }

  get reservationsToDisplay(): Reservation[] {
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.pageSize
    return this.reservations.slice(
      startIndex,
      startIndex + this.pagination.pageSize
    )
  }

  bookingFilters: TableViewFilterChip[] = [
    {
      label: 'Starting Soon',
      count: 4,
      filter: [
        {
          column: {
            _t_id: '533d2c12-0b01-4945-a375-cb7c2e2040ec',
            prop: 'startDate',
            filterType: 'gte',
          },
          value: this.currentTimestamp.format('YYYY-MM-DD'),
        },
        {
          column: {
            _t_id: '0b2c67aa-7350-4cc7-b6d0-e9cdb113ff15',
            prop: 'startDate',
            filterType: 'lte',
          },
          value: this.currentTimestamp.add(1, 'day').format('YYYY-MM-DD'),
        },
        {
          column: {
            _t_id: 'f9668131-3d1a-45ff-bbef-33c9b7cf832a',
            prop: 'reservationStatus',
            filterType: 'eq',
          },
          value: ReservationStatus.Upcoming,
        },
      ],
      active: false,
    },
    {
      label: 'Needs Acceptance',
      count: 1,
      filter: [
        {
          column: {
            _t_id: 'f9dd8140-d676-4485-9c8b-0cd2f226a2ad',
            prop: 'referralStatus',
            filterType: 'eq',
          },
          value: ReferralStatus.Offered,
        },
      ],
      active: false,
    },
    {
      label: 'Needs Assignment',
      count: 1,
      filter: [
        {
          column: {
            _t_id: '3716f4e0-ee25-4426-9493-9cce6547475d',
            prop: 'assignedDriverPercentage',
            filterType: 'lte',
          },
          value: 99.99,
        },
        {
          column: {
            _t_id: '348a7adb-72ee-4da5-8134-753263c7663c',
            prop: 'assignedVehiclePercentage',
            filterType: 'lte',
          },
          value: 99.99,
        },
        {
          column: {
            _t_id: 'f9dd8140-d676-4485-9c8b-0cd2f226a2ad',
            prop: 'referralStatus',
            filterType: 'eq',
          },
          value: ReferralStatus.Accepted,
        },
      ],
      active: false,
    },
    {
      label: 'In Progress',
      count: 2,
      filter: [
        {
          column: {
            _t_id: '5b583f16-1d99-43c2-9e74-4f3df497c25f',
            prop: 'reservationStatus',
            filterType: 'eq',
          },
          value: ReservationStatus.Started,
        },
      ],
      active: false,
    },
    {
      label: 'Finished',
      count: 1,
      filter: [
        {
          column: {
            _t_id: 'f9668131-3d1a-45ff-bbef-33c9b7cf832a',
            prop: 'reservationStatus',
            filterType: 'eq',
          },
          value: ReservationStatus.Finished,
        },
      ],
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
    const filterIsReferral = {
      column: {
        _t_id: '5e1dfd51-9620-4cd5-9b3f-ca91ce6aadf9',
        prop: 'reservationType',
        filterType: 'eq',
      },
      value: ReservationType.Referral,
    }
    const filterUpcoming = {
      column: {
        _t_id: '533d2c12-0b01-4945-a375-cb7c2e2040ec',
        prop: 'startDate',
        filterType: 'gte',
      },
      value: this.currentTimestamp.format('YYYY-MM-DD'),
    }
    const filterInProgress = {
      column: {
        _t_id: '5b583f16-1d99-43c2-9e74-4f3df497c25f',
        prop: 'reservationStatus',
        filterType: 'eq',
      },
      value: ReservationStatus.Started,
    }

    const parentFilter = filter()
    const filterParentReferral = parentFilter.createParent('and')
    const filterParentAnd = parentFilter.createParent('and')
    filterParentAnd.add(filterParentReferral, filterIsReferral)
    const filterUpcomingOrInProgress = parentFilter.createParent('or')
    filterParentReferral.add(filterUpcomingOrInProgress, filterUpcoming)
    filterParentReferral.add(filterUpcomingOrInProgress, filterInProgress)
    parentFilter.add(filterParentAnd)
    this.filters = filterParentAnd
  }

  handleFilterClick(filterChip: TableViewFilterChip): void {
    if (filterChip.active) {
      for (const filter of filterChip.filter) {
        this.filters.remove(filter)
      }
    } else {
      for (const filter of filterChip.filter) {
        const filterParentAnd = this.filters.createParent('and')
        this.filters.add(filterParentAnd, filter)
      }
    }
    filterChip.active = !filterChip.active
    this.params.filters = this.filters.asQueryParams()
  }
}
</script>
