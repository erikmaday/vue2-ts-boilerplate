<template>
  <div :class="{ 'v-data-table__detail': isDetailTable }">
    <v-data-table
      :headers="columns"
      :items="items"
      :server-items-length="serverItemsLength"
      disable-sort
      disable-filtering
      :loader-height="2"
      v-bind="$attrs"
      :options="options"
      @pagination="$emit('pagination', $event)"
      @update:options="$emit('update:options', $event)"
    >
      <template v-if="$vuetify.breakpoint.smAndUp" #item="{ item, index }">
        <tr>
          <td
            v-for="(col, colIndex) in columns"
            :key="`column-${col.value}-${colIndex}-${index}`"
          >
            <CUDataTableCell
              :column="col"
              :row="item"
              :actions="actions"
              :is-detail-table="isDetailTable"
              :detail-name="detailName"
              :item-key="itemKey"
              v-on="$listeners"
              @refresh="$emit('refresh')"
            />
          </td>
        </tr>
      </template>
      <template v-else #item="{ item, index }">
        <div
          class="
            d-flex
            flex-column
            padding-y-3
            border-solid border-gray-mid-light border-x-0 border-t-0
          "
          :class="{
            'padding-x-3 border-b-1': isDetailTable,
            'border-b-2': !isDetailTable,
          }"
        >
          <div
            v-for="(col, colIndex) in columns"
            :key="`column-${col.value}-${colIndex}-${index}`"
          >
            <CUDataTableCell
              :column="col"
              :row="item"
              :actions="actions"
              :is-detail-table="isDetailTable"
              :detail-name="detailName"
              :item-key="itemKey"
              @refresh="$emit('refresh')"
            />
          </div>
        </div>
      </template>
      <v-pagination
        v-if="!isDetailTable"
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
    type: Number,
    required: true,
  })
  serverItemsLength!: number

  @Prop({
    type: Object,
    required: true,
  })
  options!: TableViewParameters

  @Prop({
    type: Boolean,
    default: false,
  })
  isDetailTable!: boolean

  @Prop({
    type: String,
    required: false,
  })
  detailName!: string

  @Prop({
    type: String,
    required: false,
  })
  itemKey!: string
}
</script>
