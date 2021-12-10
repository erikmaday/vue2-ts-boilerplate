<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <div class="cu-data-table__cell">
    <template v-if="header.value === 'actions'">
      <CUDataTableActionColumn
        :actions="actions"
        :row="row"
        :collection-name-singular="collectionNameSingular"
        @refresh="$emit('refresh')"
      />
    </template>
    <template v-else-if="header.value === 'phone'">
      <a :href="`tel:${cellItem}`">
        {{ phoneFormatFilter(String(cellItem)) }}
      </a>
    </template>
    <template v-else-if="header.value === 'email'">
      <a :href="`mailto:${cellItem}`">{{ cellItem }}</a>
    </template>
    <template v-else-if="header.value === 'details'">
      <router-link
        class="font-medium font-14"
        :to="{ path: `edit/${row.id}` }"
        :append="true"
      >
        Details
      </router-link>
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
import { DataTableHeader } from '@/models/DataTableHeader'

@Component({
  components: { CUDataTableActionColumn },
})
export default class CUDataTableCell extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  row!: unknown

  @Prop({
    type: Object,
    required: true,
  })
  header!: DataTableHeader

  @Prop({
    type: Array,
    required: false,
    default: undefined,
  })
  actions!: Array<ActionColumn>

  @Prop({
    type: String,
    required: false,
  })
  collectionNameSingular!: string

  get cellItem() {
    return this.row[this.header.value]
  }

  get computedCellItemText(): unknown {
    if (this.header.computedText) {
      return this.header.computedText(this.row)
    }
    return this.cellItem
  }
}
</script>

<style></style>
