<template>
  <v-container>
    <NotFoundLayout />
  </v-container>
</template>

<script lang="ts">
import NotFoundLayout from '@/layouts/NotFoundLayout.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    NotFoundLayout,
  },
})
export default class NotFound extends Vue {}
</script>
