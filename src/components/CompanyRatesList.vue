<template>
  <div>
    <CUDataTable
      :columns="columns"
      :items="ratesMap"
      :options="{}"
      :serverItemsLength="ratesMap.length"
      editable
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

@Component({
  components: { CUDataTable }
})
export default class CompanyRatesList extends Vue {
  companyRates: Rate[] = []

  mounted(): void {
    this.getCompanyRates()
  }

  columns = [
    { text: 'Vehicle Type', value: 'vehicleType' },
    { text: 'Transfer', value: 'transferRate' },
    { text: 'Dead Mile', value: 'deadMileRate' },
    { text: 'Live Mile', value: 'mileageRate' },
    { text: 'Hourly', value: 'hourlyRate' },
    { text: 'Hr Min', value: 'hourlyMinimum' },
    { text: 'Daily', value: 'dailyRate' },
  ]

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
