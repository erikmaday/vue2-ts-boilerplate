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

      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CUDataTableActionColumn from '@/components/CUDataTableActionColumn.vue'

export default Vue.extend({
  props: {
    actions: {
      type: Array,
      default: undefined,
    },
  },
  components: {
    CUDataTableActionColumn,
  },
  data() {
    return {
      headers: [
        { text: 'Actions', value: 'actions' },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Type', value: 'type' },
      ],
      items: [
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
      ],
    }
  },
})
</script>
