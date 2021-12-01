<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      disable-sort
      disable-filtering
    >
      <template v-if="actions" #item.actions="{ item }">
        <CUDataTableActionColumn :actions="actions" />
      </template>
      <template #item.phone="{ item }">
        <a :href="`tel:${item.phone}`">
          {{ phoneFormatFilter(String(item.phone)) }}
        </a>
      </template>
      <template #item.email="{ item }">
        <a :href="`mailto:${item.email}`">{{ item.email }}</a>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'
import { phoneFormatFilter } from '@/utils/phone'
import { ActionColumn } from '@/models/ActionColumn'

@Component({
  components: { CUDataTableActionColumn },
})
export default class CUDataTable extends Vue {
  @Prop({
    type: Array,
    required: false,
    default: undefined,
  })
  actions!: Array<ActionColumn>

  phoneFormatFilter = phoneFormatFilter

  // TEmp data for testing
  headers = [
    { text: 'Actions', value: 'actions' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Phone', value: 'phone' },
    { text: 'Type', value: 'type' },
  ]

  items = [
    {
      name: 'Peter Lam',
      email: 'peter.lam@charterup.com',
      phone: 9783539016,
      type: 'Driver',
    },
    {
      name: 'Erik Maday',
      email: 'erikm@charterup.com',
      phone: 1231231233,
      type: 'Admin',
    },
  ]
}
</script>
