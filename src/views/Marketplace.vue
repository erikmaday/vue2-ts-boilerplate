<template>
  <Main>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="vehicleId"
      collection="vehicles"
      :tab-filters="tabFilters"
      :fetch-method="tableView"
      :is-filter-dialog-open.sync="isFilterDialogOpen"
    >
      <template slot="filter-row">
        <v-spacer />
        <v-col class="shrink">
          <v-btn color="primary" small @click="isFilterDialogOpen = true">
            <CUIcon color="white" class="margin-r-2">filter</CUIcon>
            Filter
          </v-btn>
        </v-col>
      </template>
    </CUCollectionTable>
  </Main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import MarketplaceListBidPrice from '@/components/MarketplaceListBidPrice.vue'
import MarketplaceListExpiration from '@/components/MarketplaceListExpiration.vue'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { sort } from '@/utils/sort'
import { filter } from '@/utils/filter'
import { Reservation, TableViewTrip } from '@/models/dto'
import { pluralize } from '@/utils/string'
import { RawLocation } from 'vue-router'
import trip from '@/services/trip'
import { ReservationStatus } from '@/utils/enum'
import { TableViewFilter } from '@/models/TableView'

@Component({ components: { Main, CUDataTableFilters, CUCollectionTable } })
export default class Marketplace extends Vue {
  isFilterDialogOpen = false
  sorts: any = sort()
  filters: any = filter()

  columns: DataTableColumn[] = [
    {
      _t_id: 'f06471a9-345b-4ab5-a7ec-3f3e905c858a',
      text: 'Created On',
      value: 'createdOn',
    },
    {
      _t_id: 'c70e5684-0bab-4fd0-bcaa-9a61b459b552',
      text: 'Trip ID',
      value: 'tripId',
      sortProp: 'tripId',
      defaultSort: true,
      hidden: true,
    },
    {
      _t_id: '755e663f-0126-4f31-a642-94b90dfc81cc',
      text: 'Pickup/Destination',
      value: 'stops[0].address.city',
      computedText: (row: TableViewTrip): string =>
        this.formatPickupDestination(row),
    },
    {
      _t_id: 'a40e2a3e-25d7-4f1f-bff0-d0296d7a0d25',
      text: 'Pickup Date',
      value: 'startDate',
      sortable: true,
      sortProp: 'startDate',
      computedText: (row: TableViewTrip): string =>
        this.formatReservationStartDate(row),
    },
    {
      _t_id: '2c1660f9-ba0a-46b8-8ee5-32ec50728901',
      text: 'Vehicles',
      value: 'requiredVehicles',
      computedText: (row: TableViewTrip): string => this.formatVehicles(row),
    },
    {
      _t_id: '2c1660f9-ba0a-46b8-8ee5-32ec50728901',
      text: 'Drivers',
      value: 'requiredDrivers',
      sortable: true,
      sortProp: 'requiredDrivers',
    },
    {
      _t_id: 'b9b4e35d-f241-4799-b5df-17a5b2574228',
      text: 'Expiration',
      value: 'biddingEndDate',
      sortable: true,
      sortProp: 'biddingEndDate',
      component: MarketplaceListExpiration,
      type: 'slot',
    },
    {
      _t_id: '67517e7f-61e8-4421-b58a-8db07b67123f',
      text: 'Bid Price',
      value: 'bids',
      type: 'slot',
      component: MarketplaceListBidPrice,
    },
    {
      _t_id: '47345e11-754c-480b-a415-133569a01347',
      text: '',
      value: 'details',
      type: 'details',
    },
    {
      _t_id: '4632622e-6507-4a2b-ab15-d5422afffc0d',
      text: '',
      value: 'actions',
      type: 'actions',
    },
  ]

  tabFilters: TableViewFilter[] = [
    {
      column: {
        _t_id: 'e6b676ab-b001-4cb1-a825-e905058a0616',
        text: 'New',
        value: 'createdOn',
        type: 'date',
        method: 'or',
        filterType: 'gte',
      },
      value: `${(this as any)
        .$dayjs()
        .utc()
        .format('YYYY-MM-DD')}T00:00:00.000+00:00`,
      default: true,
    },
    {
      column: {
        _t_id: 'c2f34049-1f92-4dff-9597-a8221e441ae6',
        value: '',
        filterType: '',
        text: 'All',
      },
      value: null,
      isShowAll: true,
    },
  ]

  tableView = trip.tableView

  formatReservationStartDate(trip: TableViewTrip): string {
    const firstStop = trip.stops?.[0]
    const datetime = (this as any)
      .$dayjs(firstStop?.pickupDate)
      .tz(firstStop?.address?.timeZone)
    return datetime.format('MMM D, YYYY\nh:mma z')
  }

  formatPickupDestination(trip: TableViewTrip): string {
    const firstPickup = trip.stops?.[0]
    const firstDropoff = trip.stops?.[1] || firstPickup
    return `${firstPickup.address.city} > ${firstDropoff.address.city}`
  }

  formatVehicles(trip: TableViewTrip): string {
    let string = ''
    for (const vehicle of trip.requiredVehicles) {
      string = `${string}${vehicle.requiredVehicles} ${pluralize(
        vehicle.requiredVehicles,
        vehicle.vehicleType
      )}\n`
    }
    return string
  }

  actions: ActionColumn[] = [
    {
      displayText: 'Details',
      key: 'details',
      color: 'primary',
      icon: '',
      confirmModal: false,
      ariaLabel: 'View Booking Details',
      isDetail: true,
      detailRoute: (row: Reservation): RawLocation => {
        return {
          name: 'bid-detail',
          params: { id: String(row.tripId) },
        }
      },
    },
  ]
}
</script>
