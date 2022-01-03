<template>
  <div>
    <v-btn color="primary" small @click="addNew">Add New</v-btn>
    <CUDataTable
      :columns="columns"
      :items="dataTableItems"
      :actions="actions"
      :options="{}"
      :serverItemsLength="ratesMap.length"
      editable
      @click="addNew"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import rate from '@/services/rate'
import { filter } from '@/utils/filter'
import { Rate } from '@/models/dto/Rate'
import CUDataTable from '@/components/CUDataTable.vue'
import { titleCaseToCamelCase } from '@/utils/string'
import { ActionColumn } from '@/models/ActionColumn'

@Component({
  components: { CUDataTable },
})
export default class CompanyRatesList extends Vue {
  companyRates: Rate[] = []

  dataTableItems: any[] = [
    {
      vehicleType: 'Mini Bus',
      mileageRate: 1,
      dailyRate: 1,
      deadMileRate: 1,
      transferRate: 1,
      hourlyRate: 1,
      hourlyMinimum: 1,
      isEditable: false,
    },
  ]

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit Rate',
      action: (row: Rate): void => {
        row.isEditable = true
      },
    },
    {
      displayText: 'Delete',
      key: 'delete',
      color: 'error',
      icon: 'trash',
      confirmModal: true,
      confirmModalText: 'Are you sure you want to delete this rate?',
      action: function (row: Rate): void {
        console.log("> delete rate:", row)
      },
    },
    {
      displayText: 'Save',
      hide: true,
      key: 'editable-commit',
      color: 'primary',
      icon: 'check',
      ariaLabel: 'Update Rate',
      action: function (row: Rate): void {
        console.log("> save rate:", row)
      },
    },
  ]

  mounted(): void {
    this.getCompanyRates()
  }

  columns = [
    { text: 'Vehicle Type', value: 'vehicleType', type: 'add-new-select' },
    { text: 'Transfer', value: 'transferRate', type: 'editable' },
    { text: 'Dead Mile', value: 'deadMileRate', type: 'editable' },
    { text: 'Live Mile', value: 'mileageRate', type: 'editable' },
    { text: 'Hourly', value: 'hourlyRate', type: 'editable' },
    { text: 'Hr Min', value: 'hourlyMinimum', type: 'editable' },
    { text: 'Daily', value: 'dailyRate', type: 'editable' },
    { text: 'Actions', value: 'actions', type: 'actions' }
  ]

  addNew(): void {
    let item = {
      vehicleType: undefined,
      mileageRate: 0,
      dailyRate: 0,
      deadMileRate: 0,
      transferRate: 0,
      hourlyRate: 0,
      hourlyMinimum: 0,
      isEditable: true,
      isAddNew: true,
    }

    this.dataTableItems = [item, ...this.dataTableItems]
  }

  get ratesMap(): any {
    const reduceFn = (newObj, item) => {
      newObj[item.vehicleType] = newObj[item.vehicleType] || {}
      const marketRateType = titleCaseToCamelCase(item.marketRateType)

      newObj[item.vehicleType][marketRateType] = item.highRate
      if (marketRateType === 'hourlyRate') {
        newObj[item.vehicleType].hourlyMinimum = item.hourlyMinimum
      }

      return newObj
    }
    const vehicleObjects = this.companyRates.reduce(reduceFn, {})
    return Object.entries(vehicleObjects).map(([key, val]) => ({vehicleType: key, ...val}))
  }

  async getCompanyRates(): Promise<void> {
    const filterUtil = filter()
    const grandParent = filterUtil.createParent('and')
    // const parent = filterUtil.createParent('and', grandParent)

    const marketplaceFilter = {
      column: {
        _t_id: 'f4dfd72a',
        prop: 'marketplace',
        filterType: 'eq',
      },
      value: 0,
    }

    filterUtil.add(grandParent, marketplaceFilter)

    const res = await rate.tableView({
      pageSize: -1,
      page: 1,
      filters: filterUtil.asQueryParams(),
    })

    this.companyRates = res.data.resultList
  }
}
</script>
