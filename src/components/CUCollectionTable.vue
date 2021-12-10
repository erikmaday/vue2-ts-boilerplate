<template>
  <CUDataTable
    :actions="actions"
    :options="options"
    :columns="columns"
    :items="items"
    :item-key="itemKey"
    :loading="loading"
    :server-items-length="serverItemsLength"
    :collection-name-singular="collectionNameSingular"
    @update:options="load"
    @pagination="options = $event"
    @refresh="load"
  />
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import { TableViewParameters } from '@/models/TableView'
import { AxiosResponse } from 'axios'
import { DataTableColumn } from '@/models/DataTableColumn'

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
  collectionNameSingular!: string

  @Prop({
    type: String,
    required: false,
  })
  itemKey!: string

  @Prop(Function)
  fetchMethod!: any

  items: unknown[] = []
  loading = false
  serverItemsLength = 0

  options: TableViewParameters = {
    page: 1,
    pageSize: 10,
  }

  mounted(): void {
    this.load()
  }

  async load(): Promise<void> {
    this.loading = true
    const response: AxiosResponse = await this.fetchMethod(this.options)
    const { data } = response

    this.serverItemsLength = data.count

    const items: unknown[] = data.resultList

    this.items = items.map((item: any) => {
      const obj = { id: item[this.itemKey] }
      return Object.assign({}, item, obj)
    })
    this.loading = false
  }
}
</script>
