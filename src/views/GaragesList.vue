<template>
  <div>
    <v-row class="padding-b-6">
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
      :noDataText="'No matching garages found'"
      :is-filter-dialog-open.sync="isFilterDialogOpen"
    />
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
import { RawLocation } from 'vue-router'
import { AxiosResponse } from 'axios'
import { ApiResult } from '@/models/dto'

@Component({
  components: { CUCollectionTable, CUDataTableFilters },
})
export default class GaragesList extends Vue {
  isFilterDialogOpen = false

  columns: DataTableColumn[] = [
    {
      _t_id: 'ba48443e-9a0d-438f-b680-4b2ee8e08ff0',
      text: 'Name',
      value: 'garageName',
      filterable: true,
      sortable: true,
      filterProp: 'garageName',
      filterType: 'contains',
      sortProp: 'garageName',
    },
    {
      _t_id: '3be517d2-018a-4b80-9439-48c007c4b24a',
      text: 'Address',
      value: 'address',
      computedText: (row): string => `${row.address.street1}`,
      filterable: true,
      sortable: true,
      filterProp: ['address/street1', 'address/street2'],
      filterType: 'contains',
      sortProp: 'address/street1',
    },
    {
      _t_id: 'b6b7bfd8-02ab-4f72-ab34-b36eefc2e2aa',
      text: 'City / State',
      value: 'address',
      computedText: (row): string =>
        `${row.address.city}, ${row.address.state}`,
      filterable: true,
      sortable: true,
      filterProp: ['address/city', 'address/state'],
      filterType: 'contains',
      sortProp: 'address/city',
    },
    {
      _t_id: 'b5b084df-db49-495d-a4fd-bdf7f1a208d0',
      text: 'Vehicles',
      value: 'noOfVehicles',
      filterable: true,
      sortable: true,
      filterProp: 'noOfVehicles',
      filterType: 'eq',
      sortProp: 'noOfVehicles',
    },
    {
      _t_id: '86f7f500-a9b1-4df1-bff8-f43bff32fb2c',
      text: 'Actions',
      value: 'actions',
      type: 'actions',
    },
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
      action: async (row: Garage): Promise<AxiosResponse<ApiResult>> => {
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
      detailRoute: (row: Garage): RawLocation => {
        return {
          name: 'garages.view',
          params: { id: String(row?.garageId) },
        }
      },
    },
  ]
}
</script>
