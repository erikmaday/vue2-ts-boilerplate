<template>
  <div>
    <h1>Vehicles</h1>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="vehicleId"
      collection="vehicles"
      :fetch-method="tableView"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import vehicle from '@/services/vehicle'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { Vehicle } from '@/models/dto/Vehicle'
import { RawLocation } from 'vue-router'

@Component({
  components: { CUCollectionTable },
})
export default class VehiclesList extends Vue {
  columns: DataTableColumn[] = [
    {
      _t_id: '53a7edf7-93a6-45bb-8ba0-12acfd68a2ce',
      text: 'Name',
      value: 'vehicleName',
    },
    {
      _t_id: 'b03d27dc-fbad-453f-a98d-83904311f791',
      text: 'Type',
      value: 'vehicleTypeName',
    },
    {
      _t_id: 'f2d23cb5-a14e-4dab-b747-d5fe937c8d26',
      text: 'License Plate',
      value: 'licensePlate',
    },
    {
      _t_id: 'eec52a62-8881-4fc0-a5a9-9f69fc35eec4',
      text: 'Garage',
      value: 'garageName',
    },
    {
      _t_id: 'c10e1fda-b1a4-4b8e-934d-908d13a9a26d',
      text: 'Make',
      value: 'vehicleMake',
      computedText: (row): string =>
        `${row.vehicleYear} ${row.vehicleMake} ${row.vehicleModel} - ${row.passengerCapacity} pax`,
    },
    {
      _t_id: '89e4030c-f2ed-4ea5-a468-79370b1eb0b1',
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
    {
      displayText: 'Details',
      key: 'details',
      color: 'primary',
      icon: '',
      confirmModal: false,
      ariaLabel: 'View Vehicle Details',
      isDetail: true,
      detailRoute: (row: Vehicle): RawLocation => {
        return {
          name: 'vehicles.view',
          params: { id: row.vehicleId.toString() },
        }
      },
    },
  ]
}
</script>
