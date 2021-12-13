<template>
  <div>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="garageName"
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
import { User } from '@/models/dto'
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
  ]

  tableView = garage.tableView

  actions: ActionColumn[] = [
    // {
    //   displayText: 'Edit',
    //   key: 'edit',
    //   icon: 'edit',
    //   color: 'primary',
    //   ariaLabel: 'Edit Garage',
    //   action: (row: Garage): void => {
    //     this.$router.push({
    //       name: 'garages.edit',
    //       params: { id: String(row.garageName) },
    //     })
    //   },
    // },
    // {
    //   displayText: 'Delete User',
    //   key: 'delete',
    //   color: 'error',
    //   icon: 'trash',
    //   confirmModal: true,
    //   confirmModalText: 'Are you sure you want to delete this user?',
    //   action: (row: User): void => {
    //     user.delete(row.userId)
    //   },
    // },
  ]
}
</script>
