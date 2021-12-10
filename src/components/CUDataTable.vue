<template>
  <div>
    <v-data-table
      :headers="columns"
      :items="items"
      :server-items-length="serverItemsLength"
      disable-sort
      disable-filtering
      :loader-height="2"
      v-bind="$attrs"
      @pagination="$emit('pagination', $event)"
      @update:options="$emit('update:options', $event)"
    >
      <template #item="{ item, index }">
        <tr>
          <td
            v-for="(col, colIndex) in columns"
            :key="`column-${col.value}-${colIndex}-${index}`"
          >
            <CUDataTableCell
              :column="col"
              :row="item"
              :actions="actions"
              :collection-name-singular="collectionNameSingular"
            />
          </td>
        </tr>
      </template>
      <v-pagination
        v-model="options.page"
        :length="serverItemsLength"
      ></v-pagination>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'
import { ActionColumn } from '@/models/ActionColumn'
import CUDataTableCell from '@/components/CUDataTableCell.vue'
import { DataTableColumn } from '@/models/DataTableColumn'
import { TableViewParameters } from '@/models/TableView'

@Component({
  components: { CUDataTableActionColumn, CUDataTableCell },
})
export default class CUDataTable extends Vue {
  @Prop({
    type: Array,
    required: false,
    default: undefined,
  })
  actions!: Array<ActionColumn>

  @Prop({
    type: Array,
    required: false,
    default: undefined,
  })
  items!: Array<any>

  @Prop({
    type: Array,
    required: true,
    default: [],
  })
  columns!: Array<DataTableColumn>

  @Prop({
    type: String,
    required: false,
  })
  collectionNameSingular!: string

  @Prop({
    type: Number,
    required: true,
  })
  serverItemsLength!: number

  @Prop({
    type: Object,
    required: true,
  })
  options!: TableViewParameters
}
</script>
