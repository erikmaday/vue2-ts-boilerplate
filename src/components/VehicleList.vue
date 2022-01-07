<template>
  <div>
    <v-row class="padding-b-6">
      <v-col class="shrink">
        <h1>Vehicles</h1>
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
      item-key="vehicleId"
      collection="vehicles"
      :fetch-method="tableView"
      :filters="filters"
      :sorts="sorts"
    />
    <CUDataTableFilters
      v-model="isFilterDialogOpen"
      :columns="columns"
      :filters.sync="filters"
      :sorts.sync="sorts"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import vehicle from '@/services/vehicle'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { Vehicle } from '@/models/dto/Vehicle'
import { sort } from '@/utils/sort'
import { filter } from '@/utils/filter'

@Component({
  components: { CUCollectionTable, CUDataTableFilters },
})
export default class VehiclesList extends Vue {
  isFilterDialogOpen = false
  sorts: any = sort()
  filters: any = filter()

  columns: DataTableColumn[] = [
    {
      _t_id: 'c9ba7e34-e446-4b83-9549-905f7771e42d',
      text: 'Name',
      value: 'vehicleName',
      filterable: true,
      sortable: true,
      filterProp: 'vehicleName',
      filterType: 'contains',
      sortProp: 'vehicleName',
    },
    {
      _t_id: '998657d7-a6e7-457b-b501-4edc2c82834b',
      text: 'Type',
      value: 'vehicleTypeName',
      filterable: true,
      sortable: true,
      filterProp: 'vehicleTypeName',
      filterType: 'contains',
      sortProp: 'vehicleTypeName',
    },
    {
      _t_id: 'ec2d77eb-c12f-48f7-b930-ac94b4c41dbb',
      text: 'License Plate',
      value: 'licensePlate',
      filterable: true,
      sortable: true,
      filterProp: 'licensePlate',
      filterType: 'contains',
      sortProp: 'licensePlate',
    },
    {
      _t_id: '56218905-133e-49e3-b7c6-50ddcfe612df',
      text: 'Garage',
      value: 'garageName',
      filterable: true,
      sortable: true,
      filterProp: 'garageName',
      filterType: 'contains',
      sortProp: 'garageName',
    },
    {
      _t_id: '692cc85d-baf3-43d8-b9da-5f03b4f03545',
      text: 'Make',
      value: 'vehicleMake',
      computedText: (row): string =>
        `${row.vehicleYear} ${row.vehicleMake} ${row.vehicleModel} - ${row.passengerCapacity} pax`,
    },
    {
      _t_id: '9b17a3a0-2726-44ee-871a-878f624c32b2',
      text: '',
      value: 'details',
      type: 'details',
    },
    {
      _t_id: 'eca61191-cb99-4419-95ea-2810f9d01147',
      text: '',
      value: 'actions',
      type: 'actions',
    },
  ]

  tableView = vehicle.tableView

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit Vehicle',
      action: (row: Vehicle): void => {
        this.$router.push({
          name: 'vehicles.edit',
          params: { id: String(row.vehicleId) },
        })
      },
    },
    {
      displayText: 'Delete Vehicle',
      key: 'delete',
      color: 'error',
      icon: 'trash',
      confirmModal: true,
      ariaLabel: 'Delete Vehicle',
      confirmModalText: 'Are you sure you want to delete this vehicle?',
      action: async (row: Vehicle) => {
        return vehicle.delete(row.vehicleId)
      },
    },
  ]
}
</script>
