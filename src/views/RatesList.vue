<template>
  <div>
    <v-row
      class="padding-x-3 padding-y-4"
      justify="space-between"
      align="center"
    >
      <h1>Rates</h1>
      <v-btn color="primary" small @click="displayNewRateRow">Add New</v-btn>
    </v-row>
    <v-form v-if="dataTableItems" ref="rates-form">
      <CUDataTable
        ref="rates-data-table"
        :columns="columns"
        :items="dataTableItems"
        :actions="actions"
        :options="{}"
        :mobile-view="'md'"
        :serverItemsLength="dataTableItems.length"
        is-editable-table
        display-actions-on-mobile
        @cancel-add="closeNewRow"
        @cancel-update="(e) => cancelUpdate(e)"
        @add="(e) => addRate(e)"
        @update="(e) => updateRow(e)"
        @update-editable-input="(e) => updateInput(e)"
        @update-editable-select="(e) => updateSelect(e)"
      />
    </v-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import rate from '@/services/rate'
import { filter } from '@/utils/filter'
import { Rate, RateMapItem, RateTableRow } from '@/models/dto/Rate'
import CUDataTable from '@/components/CUDataTable.vue'
import { titleCaseToCamelCase } from '@/utils/string'
import { ActionColumn } from '@/models/ActionColumn'
import typeService from '@/services/type'
import { AxiosResponse } from 'axios'
import deepClone from '@/utils/deepClone'
import { EventBus } from '@/utils/eventBus'
import {
  buildAddRatePayload,
  buildEmptyRateRow,
  buildUpdateRatePayload,
  getMarketRateIdsForRow,
} from '@/utils/rate'
import auth from '@/store/modules/auth'
import company from '@/services/company'
import { VehicleType } from '@/models/dto'

@Component({
  components: { CUDataTable },
})
export default class RatesList extends Vue {
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
      action: async function (row: RateTableRow): Promise<void> {
        const ids = getMarketRateIdsForRow(row)
        for (const id of ids) {
          await rate.delete(id)
        }
        EventBus.$emit('refresh')
      },
    },
  ]

  mounted(): void {
    EventBus.$on('refresh', this.getCompanyRates)
    this.getCompanyRates()
    this.setVehicleTypes()
  }

  @Watch('ratesMap', { deep: true, immediate: true })
  onRatesMapChange(newVal: any): void {
    if (newVal != null) {
      this.dataTableItems = deepClone(newVal)
    }
  }

  columns = [
    {
      text: 'Vehicle Type',
      value: 'vehicleType',
      type: 'add-new-select',
      styleClasses: 'min-w-132 max-w-132',
    },
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
      text: 'Hr. Min',
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

  closeNewRow() {
    this.dataTableItems = this.dataTableItems.filter((item) => !item.isNewRow)
  }

  async addRate(row: RateTableRow): Promise<void> {
    // Close any of the edit rows before validating the form
    // I tried wrapping individual rows in v-forms to validate them,
    // but that introduced a ton of layout issues. Alternative would
    // be to manually verify each input, but for now just wrapping
    // the whole table in a v-form
    for (const rate of this.dataTableItems) {
      if (!rate.isNewRow) {
        rate.isEditable = false
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form: any = this.$refs['rates-form']
    if (!form.validate()) {
      return
    }

    const companyId = auth.getUser.companyId
    const res = await company.getById(companyId)
    const marketId = res.data.company.address.nearestMarketId || 1
    const ratePayloads = buildAddRatePayload(row, companyId, marketId)

    for (const payload of ratePayloads) {
      await rate.create(payload)
    }

    this.$nextTick(() => {
      this.getCompanyRates()
      form.reset()
    })
  }

  async updateRow(row: RateTableRow): Promise<void> {
    this.closeNewRow()
    const form: any = this.$refs['rates-form']
    const vehicleTypeKey = this.getVehicleTypeKeyForLabel(row.vehicleType)
    if (!form.validate() || !vehicleTypeKey) {
      return
    }

    const companyId = auth.getUser.companyId
    const res = await company.getById(companyId)
    const marketId = res.data.company.address.nearestMarketId || 1
    const payloads = buildUpdateRatePayload(
      row,
      companyId,
      marketId,
      vehicleTypeKey
    )
    for (const payload of payloads) {
      await rate.update(payload)
    }

    this.$nextTick(() => {
      this.getCompanyRates()
    })
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

  updateSelect({ rowIndex, value }: { rowIndex: number; value: string }): void {
    this.dataTableItems[rowIndex].vehicleType = value
  }

  // To display a new rate row, push an empty rate object to the
  // beginning of the data table items 
  displayNewRateRow(): void {
    if (this.dataTableItems.find((row) => row.isNewRow)) {
      return
    }

    const emptyRateRow = buildEmptyRateRow(this.availableVehicleTypes)
    this.dataTableItems.unshift(emptyRateRow)
  }

  get ratesMap(): RateMapItem[] {
    const reduceFn = (newObj: any, item: any) => {
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
        vehicleTypeId: item.vehicleTypeId,
      }
      if (marketRateType === 'hourlyRate') {
        newObj[item.vehicleType].hourlyMinimum = {
          value: item.hourlyMinimum,
          marketRateId: item.marketRateId,
          companyId: item.companyId,
          marketId: item.marketId,
          marketplace: item.marketplace,
          marketRateType: item.marketRateType,
          vehicleTypeId: item.vehicleTypeId,
        }
      }

      return newObj
    }
    if (!this.companyRates) return []
    const vehicleObjects = this.companyRates.reduce(reduceFn, {})
    return Object.entries(vehicleObjects).map(([key, val]) => ({
      vehicleType: key,
      isEditable: false,
      items: deepClone(this.vehicleTypes),
      ...val,
    }))
  }

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await typeService.vehicleTypeTableView({})
      const { data } = response
      this.vehicleTypes = data.resultList.map((vt: VehicleType) => ({
        ...vt,
        text: vt.label,
        value: vt.label,
      }))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  getVehicleTypeKeyForLabel(label: string): string | null {
    const vehicleType: VehicleType | undefined = this.vehicleTypes.find(
      (vt: VehicleType) => vt.label === label || vt.key === label
    )
    if (vehicleType) {
      return vehicleType.key
    }
    return vehicleType || null
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
      value: 1,
    }

    filterUtil.add(parentFilter, marketplaceFilter)

    const res = await rate.tableView({
      pageSize: -1,
      page: 1,
      filters: filterUtil.asQueryParams(),
    })

    this.companyRates = res.data.resultList
  }

  get availableVehicleTypes(): VehicleType[] {
    if (!this.vehicleTypes?.length) return []
    let availableVehicleTypes = this.vehicleTypes

    for (const rate of this.ratesMap) {
      const vehicleType = rate.vehicleType
      availableVehicleTypes = availableVehicleTypes.filter((vt: VehicleType) => vt.label !== vehicleType && vt.key !== vehicleType)
    }

    return availableVehicleTypes
  }
}
</script>
