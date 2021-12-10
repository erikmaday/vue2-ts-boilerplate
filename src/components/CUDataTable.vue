<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
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
            v-for="(header, headerIndex) in headers"
            :key="`header-${headerIndex}-${index}`"
          >
            <CUDataTableCell
              :header="header"
              :row="item"
              :actions="actions"
              :collection-name-singular="collectionNameSingular"
            />
          </td>
        </tr>
      </template>
      <v-pagination
        v-model="$attrs.options.page"
        :length="serverItemsLength"
      ></v-pagination>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'
import { phoneFormatFilter } from '@/utils/phone'
import { ActionColumn } from '@/models/ActionColumn'
import CUDataTableCell from '@/components/CUDataTableCell.vue'
import { DataOptions } from 'vuetify'
import { DataTableHeader } from '@/models/DataTableHeader'

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
  headers!: Array<DataTableHeader>

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
  options!: DataOptions

  phoneFormatFilter = phoneFormatFilter
}
</script>
