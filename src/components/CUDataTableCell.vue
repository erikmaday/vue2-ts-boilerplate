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
        column.type !== 'details'
      "
    >
      {{ column.text }}
    </h4>
    <template v-if="column.type === 'actions' && !$vuetify.breakpoint.xs">
      <CUDataTableActionColumn
        :actions="actions"
        :row="row"
        @refresh="$emit('refresh')"
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
    <template v-else-if="column.type === 'details'">
      <router-link
        v-if="$vuetify.breakpoint.smAndUp"
        class="font-medium font-14"
        :to="{ path: `view/${row.id}` }"
        :append="true"
      >
        Details
      </router-link>
      <v-btn
        v-else
        color="primary"
        small
        class="w-full margin-t-4"
        @click="$router.push({ path: `view/${row.id}` })"
      >
        Details
      </v-btn>
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

@Component({
  components: { CUDataTableActionColumn },
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

  get cellItem(): any {
    return this.row[this.column.value]
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
