<template>
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
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import { TableViewParameters } from '@/models/TableView'
import { AxiosResponse } from 'axios'
import { DataTableColumn } from '@/models/DataTableColumn'
import { EventBus } from '@/utils/eventBus'

@Component({
  components: { CUDataTable },
})
export default class CUCollectionTable extends Vue {
  @Prop({
    type: Array,
    required: false,
    default: () => [],
  })
  columns!: Array<DataTableColumn>

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
  actions!: Array<unknown>

  @Prop({
    type: String,
    required: false,
  })
  itemKey!: string

  @Prop(Function)
  fetchMethod!: any

  @Prop({
    required: false,
    default: () => null,
  })
  filters: any

  @Prop({
    required: false,
    default: () => null,
  })
  sorts: any

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
