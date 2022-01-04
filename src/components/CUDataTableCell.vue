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
        :key="`action-column-${rowIndex}`"
        :row="row"
        :rowIndex="rowIndex"
        @refresh="$emit('refresh')"
      />
    </template>
    <template
      v-else-if="column.type === 'actions' && row.isEditable && row.isNewRow"
    >
      <v-row>
        <v-btn xSmall icon @click="$emit('cancel-add')">
          <CUIcon color="error">close</CUIcon>
        </v-btn>
        <v-btn xSmall icon @click="$emit('add', row)">
          <CUIcon color="success">done</CUIcon>
        </v-btn>
      </v-row>
    </template>
    <template v-else-if="column.type === 'actions' && row.isEditable">
      <v-row>
        <v-btn xSmall icon @click="$emit('cancel-update', rowIndex)">
          <CUIcon color="error">close</CUIcon>
        </v-btn>
        <v-btn xSmall icon @click="$emit('update', row)">
          <CUIcon color="success">done</CUIcon>
        </v-btn>
      </v-row>
    </template>
    <template v-if="column.type === 'add-new-select' && row.isNewRow">
      <CUSelect hide-details :items="row.items" />
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
        hide-details
        type="number"
        min="0"
        :rules="[(val) => !!val]"
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
import op from 'simple-object-path'

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

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  editable!: boolean

  op = op

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
}
</script>
