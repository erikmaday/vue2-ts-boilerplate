<template>
  <div>
    <v-row justify="space-between" class="padding-b-6 padding-x-3">
      <v-col class="shrink">
        <h1>Garages</h1>
      </v-col>
      <v-spacer />
      <v-col class="shrink">
        <v-btn
          primary
          small
          color="primary"
          @click="$router.push({ name: 'garages.add' })"
        >
          Add New
        </v-btn>
      </v-col>
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
      item-key="garageId"
      collection="garages"
      :fetch-method="tableView"
    />
    <CUDataTableFilters v-model="isFilterDialogOpen" :columns="columns" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import garage from '@/services/garage'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { Garage } from '@/models/dto/Garage'
import { Location } from 'vue-router'

@Component({
  components: { CUCollectionTable, CUDataTableFilters },
})
export default class GaragesList extends Vue {
  isFilterDialogOpen = false
  columns: DataTableColumn[] = [
    { text: 'Name', value: 'garageName' },
    {
      text: 'Address',
      value: 'address',
      computedText: (row): string => `${row.address.street1}`,
    },
    {
      text: 'City / State',
      value: 'address',
      computedText: (row): string =>
        `${row.address.city}, ${row.address.state}`,
    },
    {
      text: 'Vehicles',
      value: 'noOfVehicles',
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
    {
      displayText: 'Details',
      key: 'details',
      color: 'primary',
      icon: '',
      confirmModal: false,
      ariaLabel: 'View User Details',
      isDetail: true,
      detailRoute: (row: Garage): Location => {
        return {
          name: 'garages.view',
          params: { id: String(row?.garageId) },
        }
      },
    },
  ]
}
</script>
