<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <div
    :class="
      $vuetify.breakpoint.xs
        ? 'd-flex justify-space-between align-center margin-y-1'
        : ''
    "
  >
    <h4
      v-if="
        $vuetify.breakpoint.xs &&
        column.type !== 'actions' &&
        column.type !== 'details' &&
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
    <template v-if="column.type === 'actions' && !row.isEditable">
      <CUDataTableActionColumn
        :actions="actions"
        :row="row"
        @refresh="$emit('refresh')"
      />
    </template>
    <template v-if="column.type === 'actions' && row.isEditable">
      <v-row>
        <v-btn xSmall icon @click="setEditableFalse(row)">
          <CUIcon color="error">close</CUIcon>
        </v-btn>
        <v-btn xSmall icon @click="commitEdit(row)">
          <CUIcon color="success">done</CUIcon>
        </v-btn>
      </v-row>
    </template>
    <template v-if="column.type === 'add-new-select' && row.isAddNew">
      <CUSelect hide-details />
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
        :value="computedCellItemText"
        :disabled="!row.isEditable"
        hide-details
      />
    </template>
    <template v-else>
      {{ computedCellItemText }}
    </template>
  </div>
</template>
<script lang="ts">
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'
import { ActionColumn } from '@/models/ActionColumn'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataTableColumn } from '@/models/DataTableColumn'
import { phoneFormatFilter } from '@/utils/string'
import CUTextField from '@/components/CUTextField.vue'

@Component({
  components: { CUDataTableActionColumn, CUTextField },
})
export default class CUDataTableCell extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  row!: any

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

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  editable!: boolean

  get cellItem(): any {
    return this.row[this.column.value]
  }

  get computedCellItemText(): unknown {
    if (this.column.computedText) {
      return this.column.computedText(this.row)
    }
    return this.cellItem
  }

  get commitEdit(): (row: any) => void {
    if (!this.actions) return this.setEditableFalse
    const actionCol = this.actions.find(action => action.key === 'editable-commit')
    if (!actionCol) return this.setEditableFalse
    return actionCol.action
  }

  setEditableFalse(row: any): void {
    if (row) {
      row.isEditable = false
    }
  }

  phoneFormatFilter = phoneFormatFilter
}
</script>
