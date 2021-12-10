/* eslint-disable vue/no-unused-vars */
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

      <!-- <template v-if="actions" #item.actions="{ item }">
        <CUDataTableActionColumn
          :actions="actions"
          :row="item"
          :collection-name-singular="collectionNameSingular"
          @refresh="$emit('refresh')"
        />
      </template>
      <template #item.phone="{ item }">
        <a :href="`tel:${item.phone}`">
          {{ phoneFormatFilter(String(item.phone)) }}
        </a>
      </template>
      <template #item.email="{ item }">
        <a :href="`mailto:${item.email}`">{{ item.email }}</a>
      </template>
      <template #item.details="{ item }">
        <router-link
          class="font-medium font-14"
          :to="{ path: `edit/${item.id}` }"
          :append="true"
        >
          Details
        </router-link>
      </template> -->
      <v-pagination
        v-model="$attrs.options.page"
        :length="$attrs.serverItemsLength"
      ></v-pagination>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { VuetifyItem } from '@/models/VuetifyItem'
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'
import { phoneFormatFilter } from '@/utils/phone'
import { ActionColumn } from '@/models/ActionColumn'
import CUDataTableCell from '@/components/CUDataTableCell.vue'

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
  headers!: Array<VuetifyItem>

  @Prop({
    type: String,
    required: false,
  })
  collectionNameSingular!: string

  phoneFormatFilter = phoneFormatFilter
}
</script>
