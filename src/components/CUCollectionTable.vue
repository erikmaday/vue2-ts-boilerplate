<template>
  <div>
    <CUDataTableFilters
      :key="`${collection}-list-filters`"
      :open="isFilterDialogOpen"
      :columns="columns"
      :filters="filters"
      :sorts="sorts"
      :filter-list.sync="filterList"
      :tabs="tabs"
      :chips="chips"
      :initial-filters="initialFilters"
      :loading="showLoaders"
      @initial-filters-set="initialFiltersSet = true"
      @update:sorts="$emit('update:sorts', $event)"
      @update:filters="$emit('update:filters', $event)"
      @update:open="$emit('update:is-filter-dialog-open', $event)"
    >
      <template slot="filter-row">
        <slot name="filter-row"></slot>
      </template>
    </CUDataTableFilters>

    <CUSkeletonLoaderTableView v-show="showLoaders" :columns="visibleColumns" />
    <CUDataTable
      v-show="!showLoaders"
      :actions="actions"
      :options="options"
      :columns="visibleColumns"
      :items="items"
      :item-key="itemKey"
      :loading="loading"
      :server-items-length="serverItemsLength"
      :no-data-text="noDataText"
      :hide-default-header="$vuetify.breakpoint.xs"
      :mobile-view-on-breakpoint="mobileViewOnBreakpoint"
      @update:options="updateOptions"
      @refresh="load"
      v-on="$listeners"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import {
  TableViewFilter,
  TableViewTab,
  TableViewParameters,
  TableViewChip,
} from '@/models/TableView'
import { DataTableColumn } from '@/models/DataTableColumn'
import { EventBus } from '@/utils/eventBus'
import { filter } from '@/utils/filter'
import { sort } from '@/utils/sort'
import { AxiosResponse } from 'axios'
import { ActionColumn } from '@/models/ActionColumn'
import CUSkeletonLoaderTableView from '@/components/CUSkeletonLoaderTableView.vue'
import app from '@/store/modules/app'

@Component({
  components: { CUDataTable, CUDataTableFilters, CUSkeletonLoaderTableView },
})
export default class CUCollectionTable extends Vue {
  @Prop({ type: Array, required: false, default: () => [] })
  columns!: DataTableColumn[]
  @Prop({ type: String, required: true }) collection!: string
  @Prop({ type: Array, required: false, default: () => [] })
  actions!: ActionColumn[]
  @Prop({ type: String, required: false }) itemKey!: string
  @Prop(Function) fetchMethod!: any
  @Prop({ type: Function, required: false }) supplementalRowMethod!: any
  @Prop({ required: false, default: () => filter() }) filters: any
  @Prop({ required: false, default: () => sort() }) sorts: any
  @Prop({ required: false, default: () => [] })
  initialFilters!: TableViewFilter[]
  @Prop({ required: false, default: () => [] })
  tabs!: TableViewTab[]
  @Prop({ required: false, default: () => [] })
  chips!: TableViewChip[]
  @Prop({ type: Boolean, required: false, default: false })
  isFilterDialogOpen: boolean
  @Prop({ type: String, required: false })
  noDataText!: string
  @Prop({
    type: String,
    required: false,
  })
  mobileViewOnBreakpoint!: string

  items: unknown[] = []
  loading = false
  serverItemsLength = 0
  debounce: any = null
  filterList: any[] = []
  initialFiltersSet = false
  initialLoadCompleted = false

  options: TableViewParameters = {
    page: 1,
    pageSize: 10,
  }

  get showLoaders(): boolean {
    return app.getAreLoadersEnabled && !this.initialLoadCompleted
  }

  get areInitialFiltersSet(): boolean {
    return this.initialFilters.length && !this.initialFiltersSet
  }

  get visibleColumns(): DataTableColumn[] {
    return this.columns.filter((column) => !column.hidden)
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

      // FOR BETTER SPEED, BUT MORE API CALLS, WE CAN MOVE THE CALLING OF DETAIL FUNCTIONS TO COMPONENTS SLOTTED INTO THE PROPER CELLS
      // THIS WILL DEFINITELY INCREASE SPEED, BUT ALSO THE NUMBER OF CALLS TO THE BACKEND WILL DOUBLE
      if (this.supplementalRowMethod) {
        for (const item of items) {
          await this.supplementalRowMethod(item)
        }
      }

      this.items = items.map((item: any) => {
        const obj = { id: item[this.itemKey] }
        return Object.assign({}, item, obj)
      })
      this.loading = false
      if (!this.initialLoadCompleted) {
        this.initialLoadCompleted = true
        this.$emit('initial-load-completed')
      }
    })
  }

  updateOptions(event: any): void {
    this.options = event
    this.load()
  }
}
</script>
