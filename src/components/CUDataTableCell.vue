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
      <template v-if="$vuetify.breakpoint.smAndUp">
        <div v-if="isDetailTable" class="d-flex">
          <CUIcon
            class="cursor-pointer"
            color="primary"
            ariaLabel="Click to view detail view"
            @click="$router.push(detailCellLink(row))"
          >
            view
          </CUIcon>
        </div>
        <router-link
          v-else
          class="font-medium font-14"
          :to="detailCellLink(row)"
          :append="true"
        >
          Details
        </router-link>
      </template>
      <v-btn
        v-else
        color="primary"
        small
        class="w-full margin-t-4"
        @click="$router.push(detailCellLink(row))"
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
import { RawLocation } from 'vue-router'

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

  @Prop({
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

  get cellItem(): any {
    return this.row[this.column.value]
  }

  get computedCellItemText(): unknown {
    if (this.column.computedText) {
      return this.column.computedText(this.row)
    }
    return this.cellItem
  }

  detailCellLink(row: any): RawLocation {
    const key = this.itemKey ? this.itemKey : 'id'

    if (this.detailName) {
      return { name: this.detailName, params: { id: row[key] } }
    }
    return { path: `view/${row[key]}` }
  }

  phoneFormatFilter = phoneFormatFilter
}
</script>
