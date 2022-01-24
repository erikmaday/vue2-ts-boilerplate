<template>
  <div
    v-if="items"
    :class="{
      'v-data-table__detail': isDetailTable,
      'v-data-table__editable': isEditableTable,
    }"
  >
    <v-data-table
      :headers="columns"
      :items="items"
      :server-items-length="serverItemsLength"
      disable-sort
      :mobile-breakpoint="
        $vuetify.breakpoint.thresholds[mobileViewOnBreakpoint]
      "
      disable-filtering
      :loader-height="2"
      v-bind="$attrs"
      :options="options"
      :no-data-text="noDataText"
      @pagination="$emit('pagination', $event)"
      @update:options="$emit('update:options', $event)"
    >
      <template v-if="!isMobile" #item="{ item, index }">
        <tr>
          <td
            v-for="(col, colIndex) in columns"
            :key="`column-${col.value}-${colIndex}-${index}`"
            :class="col.classes ? col.classes : ''"
          >
            <CUDataTableCell
              :column="col"
              :key="`data-table-cell-${col.value}-${colIndex}-${index}-${item[itemKey]}`"
              :row="item"
              :row-index="index"
              :actions="actions"
              :is-mobile="false"
              :is-detail-table="isDetailTable"
              :display-actions-on-mobile="displayActionsOnMobile"
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
          class="d-flex border-solid border-gray-mid-light padding-a-3 border-radius-8"
          :class="{
            'padding-x-3 border-b-1': isDetailTable,
            'border-x-1 border-y-1 margin-y-3': !isDetailTable,
            'flex-row flex-wrap': isEditableTable,
            'flex-column': !isEditableTable,
          }"
        >
          <div
            :class="{
              'flex-basis-48-percent margin-x-1-percent':
                isEditableTable && col.type !== 'actions',
              'flex-basis-full': isEditableTable && col.type === 'actions',
            }"
            v-for="(col, colIndex) in columns"
            :key="`column-${col.value}-${colIndex}-${index}`"
          >
            <CUDataTableCell
              :column="col"
              :row="item"
              :row-index="index"
              :actions="actions"
              :is-detail-table="isDetailTable"
              :is-mobile="true"
              :detail-name="detailName"
              :display-actions-on-mobile="displayActionsOnMobile"
              :item-key="itemKey"
              v-on="$listeners"
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
  actions!: ActionColumn[]

  @Prop({
    type: Array,
    required: false,
    default: undefined,
  })
  items!: any[]

  @Prop({
    type: Array,
    required: true,
    default: [],
  })
  columns!: DataTableColumn[]

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
    type: Boolean,
    required: false,
  })
  isEditableTable!: boolean
  @Prop({
    type: String,
    required: false,
  })
  itemKey!: string
  @Prop({
    type: String,
    required: false,
    default: 'xs',
  })
  mobileViewOnBreakpoint!: string
  @Prop({
    type: Boolean,
    required: false,
  })
  displayActionsOnMobile!: boolean
  @Prop({
    type: String,
    required: false,
    default: 'No data found',
  })
  noDataText!: string

  get isMobile(): boolean {
    switch (this.mobileViewOnBreakpoint) {
      case 'xs':
        return this.$vuetify.breakpoint.xs
      case 'sm':
        return this.$vuetify.breakpoint.smAndDown
      case 'md':
        return this.$vuetify.breakpoint.mdAndDown
      default:
        return false
    }
  }
}
</script>
