<template>
  <div>
    <h1>Garages</h1>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="garageId"
      collection="garages"
      :fetch-method="tableView"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import garage from '@/services/garage'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { Garage } from '@/models/dto/Garage'

@Component({
  components: { CUDataTable, CUCollectionTable },
})
export default class CompanyGaragesList extends Vue {
  columns: DataTableColumn[] = [
    { text: 'Name', value: 'garageName' },
    {
      text: 'Address',
      value: 'address',
      computedText: (row) => `${row.address.street1}`,
    },
    {
      text: 'City / State',
      value: 'address',
      computedText: (row) => `${row.address.city}, ${row.address.state}`,
    },
    { text: 'Vehicles', value: 'noOfVehicles' },
    { text: 'Details', value: 'details', type: 'details' },
    { text: 'Actions', value: 'actions', type: 'actions' },
  ]

  tableView = garage.tableView

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit Garage',
      action: (row: Garage): void => {
        this.$router.push({
          name: 'garages.edit',
          params: { id: String(row.garageId) },
        })
      },
    },
    {
      displayText: 'Delete Garage',
      key: 'delete',
      color: 'error',
      icon: 'trash',
      confirmModal: true,
      ariaLabel: 'Delete Garage',
      confirmModalText: 'Are you sure you want to delete this garage?',
      action: async (row: Garage) => {
        return garage.delete(row.garageId)
      },
    },
  ]
}
</script>
