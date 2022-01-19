<template>
  <v-container>
    <v-row class="align-center">
      <h3
        class="col shrink white-space-nowrap font-book font-weight-400 text-white font-20"
      >
        Marketplace
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
        class="col shrink white-space-nowrap text-white font-14 font-medium text-decoration-underline cursor-pointer"
        :to="{ name: 'marketplace' }"
      >
        All Bids ({{ tripCount }})
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
          color="white"
          :text-color="filter.active ? 'black-true' : 'white'"
          :outlined="!filter.active"
          class="margin-r-2 cursor-pointer margin-b-2"
          :key="`marketplace-filter-${filterIndex}`"
          @click="handleFilterClick(filter)"
        >
          {{ filter.label }}
          ({{ filter.count }})
        </v-chip>
      </v-col>
    </v-row>
    <v-row v-if="showCardLoaders">
      <v-col
        v-for="skeletonCardIndex in skeletonCardCount"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        :key="`marketplace-skeleton-${skeletonCardIndex}`"
      >
        <MarketplaceCardSkeletonLoader show-pagination show-action-message />
      </v-col>
    </v-row>
    <v-row v-else-if="tripBundlesToDisplay.length">
      <v-col
        v-for="(tripBundle, tripBundleIndex) in tripBundlesToDisplay"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        :key="`trip-${tripBundleIndex}-${tripBundle[0].quoteId}`"
      >
        <MarketplaceCard show-pagination :trips="tripBundle" />
      </v-col>
    </v-row>
    <TodayNotFound v-else message="No bids found" icon="work_off" />
    <v-row class="justify-center margin-x-0 margin-b-0 margin-t-3">
      <PaginationSkeletonLoader v-if="showCardLoaders" />
      <Pagination
        v-else
        v-model="pagination"
        active-color="white"
        inactive-color="black"
        hover-color="gray-light"
        :items="tripBundles"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TodayNotFound from '@/components/TodayNotFound.vue'
import MarketplaceCard from '@/components/MarketplaceCard.vue'
import MarketplaceCardSkeletonLoader from '@/components/MarketplaceCardSkeletonLoader.vue'
import Pagination from '@/components/Pagination.vue'
import PaginationSkeletonLoader from '@/components/PaginationSkeletonLoader.vue'
import { TableViewTrip } from '@/models/dto'
import trip from '@/services/trip'
import { filter } from '@/utils/filter'
import { sort } from '@/utils/sort'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { TodayFilterChip } from '@/models/TableView'
import app from '@/store/modules/app'

@Component({
  components: {
    MarketplaceCard,
    MarketplaceCardSkeletonLoader,
    TodayNotFound,
    Pagination,
    PaginationSkeletonLoader,
  },
})
export default class TodayMarketplace extends Vue {
  trips: TableViewTrip[] = []
  tripCount: number | null = null
  tripBundles: TableViewTrip[][] | null = []
  cardsLoading = false
  countsLoading = false
  filters: any = null
  sorts: any = null

  params = {
    pageSize: 24,
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

  chips: { [key: string]: TodayFilterChip } = {
    createdToday: {
      label: 'Created Today',
      count: 0,
      filters: [
        {
          column: {
            _t_id: '1fce4feb-760c-49ad-99f2-7ed35aa794e2',
            value: 'createdOn',
            filterType: 'gte',
            type: 'date',
            text: '',
          },
          value: `${(this as any)
            .$dayjs()
            .format('YYYY-MM-DD')}T00:00:00.000+00:00`,
        },
      ],
      active: true,
    },
    endingSoon: {
      label: 'Ending Soon',
      count: 0,
      filters: [
        {
          column: {
            _t_id: '8be3681f-dbfb-427d-8e23-13e72a8a100d',
            value: 'biddingEndDate',
            filterType: 'gte',
            text: '',
          },
          value: this.currentTimestamp.format('YYYY-MM-DDTHH:mm:ss.000+00:00'),
        },
        {
          column: {
            _t_id: 'e935bd46-1275-4805-ab5d-09b0b14f2550',
            value: 'biddingEndDate',
            filterType: 'lte',
            text: '',
          },
          value: this.currentTimestamp
            .add(1, 'day')
            .format('YYYY-MM-DDTHH:mm:ss.000+00:00'),
        },
      ],
      active: false,
    },
  }

  @Watch('params', { deep: true })
  onParamsChanged(): void {
    this.getTrips()
  }

  get skeletonCardCount(): number {
    if (this.tripBundlesToDisplay.length) {
      return this.tripBundlesToDisplay.length
    }
    return this.pagination.pageSize
  }

  get showCardLoaders(): boolean {
    return (this.cardsLoading || this.countsLoading) && app.getAreLoadersEnabled
  }

  get showCountLoaders(): boolean {
    return this.countsLoading && app.getAreLoadersEnabled
  }

  get tripBundlesToDisplay(): TableViewTrip[][] {
    if (!this.tripBundles) {
      return []
    }
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.pageSize
    return this.tripBundles.slice(
      startIndex,
      startIndex + this.pagination.pageSize
    )
  }

  get currentTimestamp(): dayjs.Dayjs {
    dayjs.extend(utc)
    return dayjs().utc()
  }

  async mounted(): Promise<void> {
    this.cardsLoading = true
    this.establishFilters()
    this.establishSorts()
    this.getAllCounts()
    this.setActiveFilters()
  }

  async getAllCounts(): Promise<void> {
    this.countsLoading = true
    this.getAllBidsCount()
    for (const key of Object.keys(this.chips)) {
      await this.getChipCount(key)
    }
    this.countsLoading = false
  }

  async getAllBidsCount(): Promise<void> {
    const response = await trip.tableView({
      page: 1,
      pageSize: 0,
      sorts: null,
      filters: null,
    })
    this.tripCount = response.data.count
  }

  async getChipCount(key: string): Promise<void> {
    const filters = filter()
    const filterParentAnd = filters.createParent('and')
    const filterParentCreatedOn = filters.createParent('and', filterParentAnd)
    for (const filter of this.chips[key].filters) {
      filters.add(filterParentCreatedOn, filter)
    }
    const response = await trip.tableView({
      page: 1,
      pageSize: 0,
      sorts: null,
      filters: filters.asQueryParams(),
    })
    this.chips[key].count = response.data.count
  }

  establishFilters(): void {
    const parentFilter = filter()
    this.filters = parentFilter
  }

  establishSorts(): void {
    const sorts = sort()
    this.sorts = sorts
    this.params.sorts = sorts.asQueryParams()
  }

  async getTrips(): Promise<void> {
    this.cardsLoading = true
    this.params.filters = this.filters.asQueryParams()
    const preliminaryTripResponse = await trip.tableView(this.params)
    const quoteIdList: string = preliminaryTripResponse.data.resultList
      .map((trip) => trip.quoteId)
      .join(',')
    const secondaryParams = { ...this.params, pageSize: -1 }
    const tripResponse = await trip.tableView(secondaryParams, quoteIdList)
    this.trips = tripResponse.data.resultList
    this.tripBundles = this.bundleTrips(this.trips)
    this.cardsLoading = false
  }

  bundleTrips(trips: TableViewTrip[]): TableViewTrip[][] {
    const bundleMap: { [quoteId: number]: TableViewTrip[] } = {}
    for (const trip of trips) {
      if (bundleMap[trip.quoteId]) {
        bundleMap[trip.quoteId].push(trip)
      } else {
        bundleMap[trip.quoteId] = [trip]
      }
    }
    return Object.values(bundleMap)
  }

  handleFilterClick(filterChip: TodayFilterChip): void {
    filterChip.active = !filterChip.active
    this.setActiveFilters()
  }

  setActiveFilters(): void {
    this.establishFilters()
    const filterInstance = this.filters
    const filterParentOrAdditionalFilters = filterInstance.createParent('or')

    const noFiltersAreActive =
      Object.values(this.chips).filter((chip) => chip.active).length === 0

    for (const filterItem of Object.values(this.chips)) {
      if (filterItem.active || noFiltersAreActive) {
        const filterParentFilterChipGroup = filterInstance.createParent(
          'and',
          filterParentOrAdditionalFilters
        )
        for (const filter of filterItem.filters) {
          filterInstance.add(filterParentFilterChipGroup, filter)
        }
      }
    }
    this.filters = filterInstance
    this.params.filters = this.filters.asQueryParams()
  }
}
</script>
