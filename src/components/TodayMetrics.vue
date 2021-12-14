<template>
  <v-container class="padding-b-0">
    <v-expand-transition>
      <v-row v-if="isOpen">
        <v-col cols="6" md="3">On Time</v-col>
        <v-col cols="6" md="3">Cancellation</v-col>
        <v-col cols="6" md="3">Tracking</v-col>
        <v-col cols="6" md="3">You've made</v-col>
      </v-row>
    </v-expand-transition>

    <v-row class="justify-center margin-x-0 margin-b-0">
      <v-col
        class="shrink padding-a-0 cursor-pointer"
        @click="isOpen = !isOpen"
      >
        <CUIcon>keyboard_arrow_down</CUIcon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CUIcon from '@/components/CUIcon.vue'

@Component({ components: { CUIcon } })
export default class TodayMetrics extends Vue {
  isOpen = true
}
</script>
