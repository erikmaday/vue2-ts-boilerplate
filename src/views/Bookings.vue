<template>
  <Main>
    <v-row class="padding-b-6">
      <v-col class="shrink">
        <h1>Bookings</h1>
      </v-col>
      <v-spacer />
      <v-col class="shrink">
        <v-btn color="primary" small @click="isFilterDialogOpen = true">
          <CUIcon color="white" class="margin-r-2">filter</CUIcon>
          Filter
        </v-btn>
      </v-col>
    </v-row>

    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="reservationId"
      collection="referrals"
      :fetch-method="tableView"
      :filters="filters"
      :sorts="sorts"
    />
    <CUDataTableFilters
      v-model="isFilterDialogOpen"
      :columns="columns"
      :filters.sync="filters"
      :sorts.sync="sorts"
      :initial-filters="initialFilters"
    />
  </Main>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { sort } from '@/utils/sort'
import { filter } from '@/utils/filter'
import reservation from '@/services/reservation'
import { Reservation } from '@/models/dto'
import {
  currencyFilter,
  formatReservationPickupDestinationText,
} from '@/utils/string'
import { RawLocation } from 'vue-router'
import BookingsListVehicleAssignments from '@/components/BookingsListVehicleAssignments.vue'
import BookingsListDriverAssignments from '@/components/BookingsListDriverAssignments.vue'
import { TableViewFilter } from '@/models/TableView'
import { ReservationType } from '@/utils/enum'

@Component({ components: { Main, CUDataTableFilters, CUCollectionTable } })
export default class Bookings extends Vue {
  isFilterDialogOpen = false
  sorts: any = sort()
  filters: any = filter()

  columns: DataTableColumn[] = [
    {
      _t_id: '93529743-558d-43ce-9502-b38a4f9f4aeb',
      text: 'ID',
      value: 'managedId',
      filterable: true,
      sortable: true,
      filterProp: 'managedId',
      filterType: 'contains',
      sortProp: 'managedId',
    },
    {
      _t_id: 'c6a51018-3361-4f70-90b0-43caebe3d1f8',
      text: 'Pickup/Destination',
      value: 'firstPickupAddress/city',
      filterable: true,
      sortable: true,
      filterProp: ['firstPickupAddress/city', 'firstDropoffAddress/city'],
      filterType: 'contains',
      sortProp: 'firstPickupAddress/city',
      computedText: (row: Reservation): string =>
        formatReservationPickupDestinationText(row),
    },
    {
      _t_id: '34b9d398-4bc9-4678-bbeb-470ecbec4133',
      text: 'Pickup Date',
      value: 'startDate',
      sortable: true,
      sortProp: 'startDate',
      computedText: (row: Reservation): string =>
        this.formatReservationStartDate(row),
    },
    {
      _t_id: '15e7ecc8-849f-446a-9522-12ca049133fc',
      text: 'Price',
      value: 'customerTotal',
      computedText: (row: Reservation): string =>
        currencyFilter(row.customerTotal),
      sortable: true,
      sortProp: 'customerTotal',
    },
    {
      _t_id: '07a7b0c4-b4c0-40ab-bd75-c5cf2cce1c78',
      text: 'Vehicles',
      value: 'vehicleAssignments',
      type: 'slot',
      component: BookingsListVehicleAssignments,
    },
    {
      _t_id: 'a3374d2d-d99d-4289-8204-4b603ead7206',
      text: 'Drivers',
      value: 'vehicleAssignments/driverAssignments',
      type: 'slot',
      component: BookingsListDriverAssignments,
    },
    {
      _t_id: 'f1cc4115-9fe5-4b23-ac4b-263cba83b973',
      text: '',
      value: 'details',
      type: 'details',
    },
    {
      _t_id: '703bd526-8d2c-4cb0-a8b1-3a526bbdc04d',
      text: '',
      value: 'actions',
      type: 'actions',
    },
  ]

  initialFilters: TableViewFilter[] = [
    {
      column: {
        _t_id: '5e1dfd51-9620-4cd5-9b3f-ca91ce6aadf9',
        value: 'reservationType',
        filterType: 'eq',
        text: '',
      },
      value: ReservationType.Referral,
    },
  ]

  tableView = reservation.tableView

  formatReservationStartDate(reservation: Reservation): string {
    const datetime = (this as any)
      .$dayjs(reservation.pickupDate)
      .tz(reservation.firstPickupTimeZone)
    return datetime.format('MMM DD, YYYY h:mma z')
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
          name: 'booking-detail',
          params: { id: String(row.reservationId) },
        }
      },
    },
  ]
}
</script>
