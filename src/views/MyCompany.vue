<template>
  <CUDataTable style="margin: 20px" :actions="actions" />
</template>
<script lang="ts">
import Vue from 'vue'
import CUDataTable from '@/components/CUDataTable.vue'

export default Vue.extend({
  components: {
    CUDataTable,
  },
  data() {
    return {
      actions: [
        { displayText: 'Edit', key: 'edit', icon: 'edit', color: 'primary' },
        { displayText: 'Delete', key: 'delete', icon: 'trash', color: 'error' },
      ],
    }
  },
})
</script>