<template>
  <Main>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="reservationId"
      collection="bookings"
      :fetch-method="tableView"
      :initial-filters="initialFilters"
      :is-filter-dialog-open.sync="isFilterDialogOpen"
      :tabs="tabs"
      :key="`bookings-list`"
      no-data-text="No matching bookings found"
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
    <CUModal v-model="isDialogOpen">
      <template #title>Reject Booking</template>
      <template #text>
        <v-form ref="rejection-form">
          <CUTextArea
            v-model="rejectNote"
            label="Why are you rejecting the booking?"
            placeholder="Add reasons for rejection here."
            :rules="[(val) => !!val || 'This field is required.']"
            validate-on-blur
          />
        </v-form>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" small text @click="cancelRejectNote">
          Cancel
        </v-btn>
        <v-btn color="red" class="white--text" small @click="reject">
          Reject
        </v-btn>
        <v-spacer />
      </template>
    </CUModal>
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
import { TableViewFilter, TableViewTab } from '@/models/TableView'
import {
  ReservationStatus,
  ReservationType,
  ReferralStatus,
} from '@/utils/enum'

@Component({ components: { Main, CUDataTableFilters, CUCollectionTable } })
export default class Bookings extends Vue {
  isFilterDialogOpen = false
  sorts: any = sort()
  filters: any = filter()
  tableView = reservation.tableView
  isDialogOpen = false
  rejectNote = ''

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
      value: 'firstPickupAddressName',
      filterable: true,
      sortable: true,
      filterProp: ['firstPickupAddressName', 'firstDropoffAddressName'],
      filterType: 'contains',
      sortProp: 'firstPickupAddressName',
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
      sortProp: 'amount',
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

  tabs: TableViewTab[] = [
    {
      column: {
        _t_id: 'e6b676ab-b001-4cb1-a825-e905058a0616',
        value: 'reservationStatus',
        filterType: 'eq',
        text: 'Upcoming',
        method: 'or',
      },
      value: ReservationStatus.Upcoming,
      default: true,
    },
    {
      column: {
        _t_id: '14e762a8-ce24-4e49-b27f-625574a5b265',
        value: 'reservationStatus',
        filterType: 'eq',
        text: 'In Progress',
        method: 'or',
      },
      value: ReservationStatus.Started,
    },
    {
      column: {
        _t_id: '70785f50-5874-4290-8079-e137bd221eba',
        value: 'reservationStatus',
        filterType: 'eq',
        text: 'Finished',
        method: 'or',
      },
      value: ReservationStatus.Finished,
    },
    {
      column: {
        _t_id: '843d2763-619d-4866-9cb9-d77ff6e5177b',
        value: '',
        filterType: '',
        text: 'All',
      },
      value: null,
      isShowAll: true,
    },
  ]

  formatReservationStartDate(reservation: Reservation): string {
    const datetime = (this as any)
      .$dayjs(reservation.pickupDate)
      .tz(reservation.firstPickupTimeZone)
    return datetime.format('MMM D, YYYY\nh:mma z')
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
    {
      displayText: 'Accept Booking',
      key: 'accept-booking',
      color: 'primary',
      icon: 'done',
      confirmModal: false,
      ariaLabel: 'Accept Booking',
      hideOn: (row: any) => row.referralStatus === ReferralStatus.Accepted,
    },
    {
      displayText: 'Reject Booking',
      key: 'reject-booking',
      color: 'error',
      icon: 'close',
      confirmModal: false,
      ariaLabel: 'Reject Booking',
      hideOn: (row: any) => row.referralStatus === ReferralStatus.Accepted,
      action: () => {
        console.log("> rejecting")
        this.isDialogOpen = true
      }
    },
  ]

  cancelRejectNote(): void {
    this.rejectNote = ''
    this.isDialogOpen = false
  }

  async accept(): Promise<void> {
    // await reservation.accept(this.reservation.reservationId)
    this.$emit('refresh')
  }

  async reject(): Promise<void> {
    // const form: any = this.$refs['rejection-form']
    // if (!form.validate()) return
    // await reservation.reject(this.reservation.reservationId, this.rejectNote)
    this.$emit('refresh')
  }
}
</script>
