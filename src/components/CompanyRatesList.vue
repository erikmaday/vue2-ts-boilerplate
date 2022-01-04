<template>
  <div>
    <v-row
      class="padding-x-3 padding-b-4"
      justify="space-between"
      align="center"
    >
      <h1>Rates</h1>
      <v-btn color="primary" small @click="addNew">Add New</v-btn>
    </v-row>
    <CUDataTable
      :columns="columns"
      :items="dataTableItems"
      :actions="actions"
      :options="{}"
      :serverItemsLength="dataTableItems.length"
      editable
      @cancel-add="cancelAdd"
      @cancel-update="(e) => cancelUpdate(e)"
      @add="(e) => addRate(e)"
      @update="(e) => updateRow(e)"
      @update-editable-input="(e) => updateInput(e)"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import rate from '@/services/rate'
import { filter } from '@/utils/filter'
import { Rate } from '@/models/dto/Rate'
import CUDataTable from '@/components/CUDataTable.vue'
import { titleCaseToCamelCase } from '@/utils/string'
import { ActionColumn } from '@/models/ActionColumn'
import typeService from '@/services/type'
import { AxiosResponse } from 'axios'
import deepClone from '@/utils/deepClone'
import op from 'simple-object-path'

@Component({
  components: { CUDataTable },
})
export default class CompanyRatesList extends Vue {
  companyRates: Rate[] = []
  vehicleTypes = []
  dataTableItems: any[] = []

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit Rate',
      action: (row: Rate, rowIndex: number): void => {
        this.setRowIsEditable(rowIndex, true)
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
        console.log('> delete rate:', row)
      },
    },
  ]

  mounted(): void {
    this.getCompanyRates()
    this.setVehicleTypes()
  }

  @Watch('ratesMap', { deep: true, immediate: true })
  onRatesMapChange(newVal: any) {
    this.dataTableItems = deepClone(newVal)
  }

  columns = [
    { text: 'Vehicle Type', value: 'vehicleType', type: 'add-new-select' },
    {
      text: 'Transfer',
      value: 'transferRate/value',
      type: 'editable',
    },
    {
      text: 'Dead Mile',
      value: 'deadMileRate/value',
      type: 'editable',
    },
    {
      text: 'Live Mile',
      value: 'mileageRate/value',
      type: 'editable',
    },
    {
      text: 'Hourly',
      value: 'hourlyRate/value',
      type: 'editable',
    },
    {
      text: 'Hr Min',
      value: 'hourlyMinimum/value',
      type: 'editable',
    },
    {
      text: 'Daily',
      value: 'dailyRate/value',
      type: 'editable',
    },
    { text: 'Actions', value: 'actions', type: 'actions' },
  ]

  // We need this auxilary function to prevent issues with 
  // accessing `this` within the actions column (running into
  // issues where it believes `this` within the function 
  // refers to the actions column)
  setRowIsEditable(rowIndex: number, value: boolean): void {
    this.dataTableItems[rowIndex].isEditable = value
  }

  cancelUpdate(rowIndex: number): void {
    this.dataTableItems[rowIndex].isEditable = false
  }

  cancelAdd() {
    this.dataTableItems = this.dataTableItems.filter((item) => !item.isNewRow)
  }

  addRate(row) {
    console.log('> add', row)
  }

  updateRow(row) {
    let values = Object.values(row)
      .filter((v) => typeof v === 'object')
      .map((v) => v.value)

    // Manual validation, since each row is rendered dynamically, we don't 
    // use a form
    // If any of the inputs have negative values or are empty
    // We don't want to check for !v here, since that rules out 0 as a value
    if (values.filter(v => v == null || v === '' || Number(v) < 0).length) {
      return
    }
 else {
      console.log("> success")
    }
  }

  updateInput({
    columnValue,
    rowIndex,
    value,
  }: {
    columnValue: string
    rowIndex: number
    value: string
  }): void {
    const columnName = columnValue.split('/')[0]
    this.dataTableItems[rowIndex][columnName].value = value
  }

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
      isNewRow: true,
      items: this.vehicleTypes.map((vt) => ({
        ...vt,
        text: vt.label,
        value: vt.key,
      })),
    }

    this.dataTableItems = [item, ...this.dataTableItems]
  }

  get ratesMap(): any {
    const reduceFn = (newObj, item) => {
      newObj[item.vehicleType] = newObj[item.vehicleType] || {
        vehicleTypeId: item.vehicleTypeId,
      }
      const marketRateType = titleCaseToCamelCase(item.marketRateType)

      newObj[item.vehicleType][marketRateType] = {
        value: item.highRate,
        marketRateId: item.marketRateId,
        companyId: item.companyId,
        marketId: item.marketId, 
        marketplace: item.marketplace,
        marketRateType: item.marketRateType,
        marketRateTypeKey: item.marketRateTypeKey,
        vehicleTypeKey: item.vehicleTypeKey
      }
      if (marketRateType === 'hourlyRate') {
        newObj[item.vehicleType].hourlyMinimum = {
          value: item.hourlyMinimum,
          marketRateId: item.marketRateId,
          companyId: item.companyId,
          marketId: item.marketId, 
          marketplace: item.marketplace,
          marketRateType: item.marketRateType,
          marketRateTypeKey: item.marketRateTypeKey,
          vehicleTypeKey: item.vehicleTypeKey
        }
      }

      return newObj
    }
    const vehicleObjects = this.companyRates.reduce(reduceFn, {})
    return Object.entries(vehicleObjects).map(([key, val]) => ({
      vehicleType: key,
      isEditable: false,
      ...val,
    }))
  }

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await typeService.vehicleTypeTableView({})
      const { data } = response
      this.vehicleTypes = data.resultList
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }
  async getCompanyRates(): Promise<void> {
    const filterUtil = filter()
    const parentFilter = filterUtil.createParent('and')

    const marketplaceFilter = {
      column: {
        _t_id: 'f4dfd72a',
        prop: 'marketplace',
        filterType: 'eq',
      },
      value: 0,
    }

    filterUtil.add(parentFilter, marketplaceFilter)

    const res = await rate.tableView({
      pageSize: -1,
      page: 1,
      filters: filterUtil.asQueryParams(),
    })

    this.companyRates = res.data.resultList
  }
}
</script>
