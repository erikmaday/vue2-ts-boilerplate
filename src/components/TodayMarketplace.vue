<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <h3
            class="
              col
              shrink
              white-space-nowrap
              font-book font-weight-400
              text-white
              font-20
            "
          >
            Marketplace
          </h3>
          <v-spacer />
          <p
            class="
              col
              shrink
              white-space-nowrap
              text-white
              font-14 font-medium
              text-decoration-underline
              cursor-pointer
            "
          >
            All Bids (30)
          </p>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-chip
              v-for="(filter, filterIndex) in marketplaceFilters"
              color="white"
              :text-color="filter.active ? 'black-true' : 'white'"
              :outlined="!filter.active"
              class="margin-r-2 cursor-pointer margin-b-2"
              :key="`marketplace-filter-${filterIndex}`"
              @click="filter.active = !filter.active"
            >
              {{ filter.label }} ({{ filter.count }})
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="(trip, tripIndex) in trips"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            :key="`trip-${tripIndex}-${trip.tripId}`"
          >
            <MarketplaceCard :trip="trip" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import MarketplaceCard from '@/components/MarketplaceCard.vue'
import { Trip } from '@/models/dto'
import trip from '@/services/trip'
import { filter } from '@/utils/filter'

@Component({ components: { MarketplaceCard } })
export default class TodayMarketplace extends Vue {
  marketplaceFilters = [
    {
      label: 'Created Today',
      count: 4,
      value: null,
      active: false,
    },
    {
      label: 'Ending Today',
      count: 1,
      value: null,
      active: false,
    },
  ]

  trips: Trip[] = []
  tripCount = 0

  params = {
    pageSize: 24, // TODO: remove this and only pull in inprogress or future trips
    page: 1,
    filters: null,
    sorts: null,
  }

  filters: any = null

  @Watch('params', { deep: true })
  onParamsChanged(): void {
    this.getTrips()
  }

  async mounted(): Promise<void> {
    this.establishFilters()
    this.getTrips(true)
  }

  establishFilters(): void {
    // const filterIsReferral = {
    //   column: {
    //     _t_id: '5e1dfd51-9620-4cd5-9b3f-ca91ce6aadf9',
    //     prop: 'reservationType',
    //     filterType: 'eq',
    //   },
    //   value: ReservationType.Referral,
    // }

    const parentFilter = filter()
    // const filterParentAnd = parentFilter.createParent('and')
    // parentFilter.add(filterParentAnd, filterIsReferral)
    this.filters = parentFilter
  }

  async getTrips(setCount = false): Promise<void> {
    this.params.filters = this.filters.asQueryParams()
    const reservationResponse = await trip.tableView(this.params)
    this.trips = reservationResponse.data.resultList
    if (setCount) {
      this.tripCount = reservationResponse.data.count
    }
  }
}
</script>
