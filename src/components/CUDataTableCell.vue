<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <div
    :class="
      isMobile ? 'd-flex justify-space-between align-center margin-y-1' : ''
    "
  >
    <h4
      v-if="
        isMobile &&
        column.type !== 'actions' &&
        column.type !== 'editable' &&
        column.type !== 'add-new-select' &&
        column.type !== 'slot'
      "
    >
      {{ column.text }}
    </h4>
    <template v-if="column.type === 'slot'">
      <component
        :is="column.component"
        :row="row"
        :actions="actions"
        v-on="$listeners"
      />
    </template>
    <template v-else-if="column.type === 'actions' && !row.isEditable">
      <CUDataTableActionColumn
        :actions="actions"
        :key="`action-column-${rowIndex}`"
        :row="row"
        :row-index="rowIndex"
        :display-actions-on-mobile="displayActionsOnMobile"
        :is-mobile="isMobile"
        :is-detail-table="isDetailTable"
        @refresh="$emit('refresh')"
      />
    </template>
    <template
      v-else-if="column.type === 'actions' && row.isEditable && row.isNewRow"
    >
      <CUDataTableRowEditActions
        :is-mobile="isMobile"
        :row="row"
        :row-index="rowIndex"
        event-name="add"
        v-on="$listeners"
      />
    </template>
    <template v-else-if="column.type === 'actions' && row.isEditable">
      <CUDataTableRowEditActions
        :is-mobile="isMobile"
        :row="row"
        :row-index="rowIndex"
        event-name="update"
        v-on="$listeners"
      />
    </template>
    <template
      v-else-if="column.type === 'add-new-select' && (row.isNewRow || isMobile)"
    >
      <CUSelect
        hide-details
        :key="`editable-select-row-${rowIndex}-${column._t_id}`"
        :label="isMobile ? column.text : null"
        :items="row.items"
        class="w-full"
        :rules="column.editableRules"
        :disabled="!row.isNewRow"
        :value="op(row, column.value)"
        validate-on-blur
        @input="
          (e) =>
            $emit('update-editable-select', {
              value: e,
              rowIndex: rowIndex,
              columnValue: column.value,
            })
        "
      />
    </template>
    <template v-else-if="column.type === 'phone'">
      <a :href="`tel:${cellItem}`">
        {{ phoneFormatFilter(String(cellItem)) }}
      </a>
    </template>
    <template v-else-if="column.type === 'email'">
      <a :href="`mailto:${cellItem}`">{{ cellItem }}</a>
    </template>
    <template v-else-if="column.type === 'editable'">
      <CUTextField
        :value="op(row, column.value)"
        :disabled="!row.isEditable"
        :key="`editable-text-field-row-${rowIndex}-${column._t_id}`"
        class="w-full"
        :label="isMobile ? column.text : null"
        hide-details
        type="number"
        validate-on-blur
        min="0"
        step="0.01"
        :rules="column.editableRules"
        @input="
          (e) =>
            $emit('update-editable-input', {
              value: e,
              rowIndex: rowIndex,
              columnValue: column.value,
            })
        "
      />
    </template>
    <template v-else>
      <span class="white-space-pre">{{ computedCellItemText }}</span>
    </template>
  </div>
</template>
<script lang="ts">
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'
import { ActionColumn } from '@/models/ActionColumn'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataTableColumn } from '@/models/DataTableColumn'
import { phoneFormatFilter } from '@/utils/string'
import op from 'simple-object-path'
import { isNotEmptyInput, isNotNegative } from '@/utils/validators'
import CUDataTableRowEditActions from '@/components/CUDataTableRowEditActions.vue'

@Component({
  components: { CUDataTableActionColumn, CUDataTableRowEditActions },
})
export default class CUDataTableCell extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  row!: any

  @Prop({
    type: Number,
    required: true,
  })
  rowIndex!: number

  @Prop({
    type: Object,
    required: true,
  })
  column!: DataTableColumn

  @Prop({
    type: Array,
    required: false,
    default: undefined,
  })
  actions!: ActionColumn[]

  op = op
  @Prop({
    type: Boolean,
    required: false,
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

  @Prop({
    type: Boolean,
    required: true,
  })
  isMobile!: boolean

  @Prop({
    type: Boolean,
    required: false,
  })
  displayActionsOnMobile!: boolean

  get cellItem(): any {
    return op(this.row, this.column.value)
  }

  get computedCellItemText(): unknown {
    if (this.column.computedText) {
      return this.column.computedText(this.row)
    }
    return this.cellItem
  }

  phoneFormatFilter = phoneFormatFilter
  isNotEmptyInput = isNotEmptyInput
  isNotNegative = isNotNegative
}
</script>
