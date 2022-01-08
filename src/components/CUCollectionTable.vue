<template>
  <div>
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
    <CUDataTableFilters
      :columns="columns"
      :filters="filters"
      :sorts="sorts"
      :open="isFilterDialogOpen"
      @update:sorts="$emit('update:sorts', $event)"
      @update:filters="$emit('update:filters', $event)"
      @update:open="$emit('update:is-filter-dialog-open', $event)"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import { TableViewParameters } from '@/models/TableView'
import { AxiosResponse } from 'axios'
import { DataTableColumn } from '@/models/DataTableColumn'
import { EventBus } from '@/utils/eventBus'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import { filter } from '@/utils/filter'
import { sort } from '@/utils/sort'

@Component({
  components: { CUDataTable, CUDataTableFilters },
})
export default class CUCollectionTable extends Vue {
  @Prop({
    type: Array,
    required: false,
    default: () => [],
  })
  columns!: DataTableColumn[]

  @Prop({
    type: String,
    required: true,
  })
  collection!: string

  @Prop({
    type: Array,
    required: false,
    default: () => [],
  })
  actions!: unknown[]

  @Prop({
    type: String,
    required: false,
  })
  itemKey!: string

  @Prop(Function)
  fetchMethod!: any

  @Prop({
    required: false,
    default: () => filter(),
  })
  filters: any

  @Prop({
    required: false,
    default: () => sort(),
  })
  sorts: any

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isFilterDialogOpen: boolean

  items: unknown[] = []
  loading = false
  serverItemsLength = 0
  debounce: any = null

  options: TableViewParameters = {
    page: 1,
    pageSize: 10,
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
    this.loading = true
    await this.$nextTick(async () => {
      let sorts, filters
      if (this.filters) {
        filters = this.filters.asQueryParams()
      }
      if (this.sorts) {
        sorts = this.sorts.asQueryParams()
      }
      const response: AxiosResponse = await this.fetchMethod({
        ...this.options,
        sorts,
        filters,
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
