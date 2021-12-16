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

@Component({
  components: { CUCollectionTable },
})
export default class CompanyVehiclesList extends Vue {
  columns: DataTableColumn[] = [
    { text: 'Name', value: 'vehicleName' },
    { text: 'Type', value: 'vehicleTypeName' },
    { text: 'Garage', value: 'garageName' },
    { text: '', value: 'details', type: 'details' },
    { text: '', value: 'actions', type: 'actions' },
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
