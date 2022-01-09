<template>
  <div>
    <CUDataTableFilters
      :open="isFilterDialogOpen"
      :columns="columns"
      :filters="filters"
      :sorts="sorts"
      :filter-list.sync="filterList"
      :categories="categoryFilters"
      :initial-filters="initialFilters"
      @initial-filters-set="initialFiltersSet = true"
      @update:sorts="$emit('update:sorts', $event)"
      @update:filters="$emit('update:filters', $event)"
      @update:open="$emit('update:is-filter-dialog-open', $event)"
    >
      <template slot="filter-row">
        <slot name="filter-row"></slot>
      </template>
    </CUDataTableFilters>
    <CUDataTable
      :actions="actions"
      :options="options"
      :columns="columns"
      :items="items"
      :item-key="itemKey"
      :loading="loading"
      :server-items-length="serverItemsLength"
      @update:options="load"
      @pagination="options = $event"
      @refresh="load"
      v-on="$listeners"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import { TableViewFilter, TableViewParameters } from '@/models/TableView'
import { DataTableColumn } from '@/models/DataTableColumn'
import { EventBus } from '@/utils/eventBus'
import { filter } from '@/utils/filter'
import { sort } from '@/utils/sort'
import { AxiosResponse } from 'axios'

@Component({
  components: { CUDataTable, CUDataTableFilters },
})
export default class CUCollectionTable extends Vue {
  @Prop({ type: Array, required: false, default: () => [] })
  columns!: DataTableColumn[]
  @Prop({ type: String, required: true }) collection!: string
  @Prop({ type: Array, required: false, default: () => [] }) actions!: unknown[]
  @Prop({ type: String, required: false }) itemKey!: string
  @Prop(Function) fetchMethod!: any
  @Prop({ required: false, default: () => filter() }) filters: any
  @Prop({ required: false, default: () => sort() }) sorts: any
  @Prop({ required: false, default: () => [] })
  initialFilters!: TableViewFilter[]
  @Prop({ required: false, default: () => [] })
  categoryFilters!: any[]
  @Prop({ type: Boolean, required: false, default: false })
  isFilterDialogOpen: boolean

  items: unknown[] = []
  loading = false
  serverItemsLength = 0
  debounce: any = null
  filterList: any[] = []
  initialFiltersSet = false

  options: TableViewParameters = {
    page: 1,
    pageSize: 10,
  }

  get areInitialFiltersSet(): boolean {
    return this.initialFilters.length && !this.initialFiltersSet
  }

  mounted(): void {
    this.load()

    EventBus.$on('set-tableview-page', (page) => {
      this.options.page = page
    })
    EventBus.$on('refresh-tableview', () => {
      this.load()
    })
  }

  async load(): Promise<void> {
    if (this.areInitialFiltersSet) {
      return
    }
    this.loading = true
    await this.$nextTick(async () => {
      const response: AxiosResponse = await this.fetchMethod({
        pageSize: this.options.pageSize,
        page: this.options.page,
        filters: this.filters.asQueryParams(),
        sorts: this.sorts.asQueryParams(),
      })
      const { data } = response

      this.serverItemsLength = data.count

      const items: unknown[] = data.resultList

      this.items = items.map((item: any) => {
        const obj = { id: item[this.itemKey] }
        return Object.assign({}, item, obj)
      })
      this.loading = false
    })
  }
}
</script>
