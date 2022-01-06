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
      :mobile-breakpoint="$vuetify.breakpoint.thresholds[mobileView]"
      disable-filtering
      :loader-height="2"
      v-bind="$attrs"
      @pagination="$emit('pagination', $event)"
      @update:options="$emit('update:options', $event)"
    >
      <template v-if="!isMobile" #item="{ item, index }">
        <tr>
          <td
            v-for="(col, colIndex) in columns"
            :key="`column-${col.value}-${colIndex}-${index}`"
            :class="col.styleClasses ? col.styleClasses : ''"
          > 
            <CUDataTableCell
              :column="col"
              :key="`data-table-cell-${col.value}-${colIndex}-${index}`"
              :row="item"
              :row-index="index"
              :actions="actions"
              :isMobile="false"
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
          class="
            d-flex
            padding-y-3
            border-solid border-gray-mid-light border-x-0 border-t-0
          "
          :class="{
            'padding-x-3 border-b-1': isDetailTable,
            'border-b-2': !isDetailTable,
            'flex-row flex-wrap': isEditableTable,
            'flex-column': !isEditableTable,
          }"
        >
          <div
            :style="`${
              col.type === 'actions'
                ? 'flex-basis: 100%'
                : 'flex-basis: 48%; margin-left: 1%; margin-right: 1%; '
            }`"
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
  mobileView!: string

  @Prop({
    type: Boolean,
    required: false,
  })
  displayActionsOnMobile!: boolean

  get isMobile(): boolean {
    switch (this.mobileView) {
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
