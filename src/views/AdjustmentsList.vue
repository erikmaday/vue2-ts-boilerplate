<template>
  <div>
    <v-row class="padding-b-6">
      <v-col class="shrink">
        <h1>Adjustments</h1>
      </v-col>
      <v-spacer />
      <v-col class="shrink">
        <v-btn
          primary
          small
          color="primary"
          @click="$router.push({ name: 'rates.adjustments.add' })"
        >
          Add New
        </v-btn>
      </v-col>
      <CUDataTableFilterButton v-model="isFilterDialogOpen" />
    </v-row>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="markupId"
      collection="markups"
      :fetch-method="tableView"
      :is-filter-dialog-open.sync="isFilterDialogOpen"
      no-data-text="No adjustments found"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import CUDataTableFilterButton from '@/components/CUDataTableFilterButton.vue'
import markup from '@/services/markup'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { RawLocation } from 'vue-router'
import { processPredefined } from '@/utils/predefined'
import { datePredefined } from '@/data/predefined'
import {
  formatMarkupStartDateTime,
  formatMarkupEndDateTime,
} from '@/utils/string'
import { Markup } from '@/models/dto/Markup'
import { AxiosResponse } from 'axios'

@Component({
  components: {
    Main,
    CUDataTable,
    CUCollectionTable,
    CUDataTableFilters,
    CUDataTableFilterButton,
  },
})
export default class AdjustmentsList extends Vue {
  isFilterDialogOpen = false

  daysMap = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  }

  columns: DataTableColumn[] = [
    {
      _t_id: '5033b892-71ba-4354-a696-0ef757234844',
      text: 'Name',
      value: 'name',
      filterable: true,
      sortable: true,
      filterProp: 'name',
      filterType: 'contains',
      sortProp: 'name',
    },
    {
      _t_id: 'da69b102-b265-421a-940c-437cdaf79cc4',
      text: 'Markup %',
      value: 'markupPercentage',
      filterable: false,
      sortable: true,
      sortProp: 'markupPercentage',
    },
    {
      _t_id: 'f79c9c2c-f914-4703-9be2-8d6b94865f11',
      text: 'Vehicle Type',
      value: 'vehicleType.label',
      filterable: true,
      sortable: true,
      filterProp: 'vehicleType.label',
      filterType: 'contains',
      sortProp: 'vehicleType.label',
      computedText: (row: Markup): string => {
        return row?.vehicleType?.label
      },
    },
    {
      _t_id: 'd1fc6af3-918a-4b9e-a26b-bd9de6d831cb',
      text: 'Rate Type',
      value: 'rateType.label',
      filterable: true,
      sortable: true,
      filterProp: 'rateType.label',
      filterType: 'contains',
      sortProp: 'rateType.label',
      computedText: (row: Markup): string => {
        return row?.rateType?.label
      },
    },
    {
      _t_id: '21443b74-5ee7-4355-94b9-4d4a5231324f',
      text: 'Days',
      value: 'markupDays.day',
      filterable: false,
      sortable: true,
      filterProp: 'markupDays.day',
      filterType: 'contains',
      sortProp: 'markupDays.day',
      computedText: (row: Markup): string => {
        const sortedDays = [...row.markupDays]
        if (sortedDays.length === 7) {
          return 'All days'
        }
        return sortedDays
          .sort((a, b) => a.day - b.day)
          .map((d) => this.daysMap[d.day])
          .join(', ')
      },
    },
    {
      _t_id: 'bd5aa8ba-e3f0-45a6-b126-c9470323da0e',
      text: 'Start Date',
      value: 'startDate',
      filterable: true,
      sortable: true,
      filterProp: 'startDate',
      sortProp: 'startDate',
      type: 'date',
      predefined: processPredefined(datePredefined),
      computedText: (row: Markup): string => formatMarkupStartDateTime(row),
    },
    {
      _t_id: 'de823465-b69f-44a5-96ff-01624126c838',
      text: 'End Date',
      value: 'endDate',
      filterable: true,
      sortable: true,
      filterProp: 'endDate',
      sortProp: 'endDate',
      type: 'date',
      predefined: processPredefined(datePredefined),
      computedText: (row: Markup): string => formatMarkupEndDateTime(row),
    },
    {
      _t_id: 'a46c5350-5c2e-4d34-867b-971ec2ec545e',
      text: 'Actions',
      value: 'actions',
      type: 'actions',
    },
  ]

  tableView = markup.tableView

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit Adjustment',
      action: (row: Markup): void => {
        this.$router.push({
          name: 'rates.adjustments.edit',
          params: { id: String(row.markupId) },
        })
      },
    },
    {
      displayText: 'Delete Adjustment',
      key: 'delete',
      color: 'error',
      icon: 'trash',
      confirmModal: true,
      ariaLabel: 'Delete Adjustment',
      confirmModalText: 'Are you sure you want to delete this adjustment?',
      confirmModalPrimaryActionText: 'Delete',
      action: async (row: Markup): Promise<AxiosResponse> => {
        return markup.deleteMarkup(row.markupId)
      },
    },
    {
      displayText: 'Details',
      key: 'details',
      color: 'primary',
      icon: '',
      ariaLabel: 'View Adjustment Details',
      isDetail: true,
      detailRoute: (row: Markup): RawLocation => {
        return {
          name: 'rates.adjustments.view',
          params: { id: row.markupId.toString() },
        }
      },
    },
  ]
}
</script>
