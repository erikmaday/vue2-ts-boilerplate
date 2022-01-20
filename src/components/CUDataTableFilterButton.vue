<template>
  <v-col class="shrink">
    <v-btn color="primary" small @click="isFilterDialogOpen = true">
      <v-badge
        :content="filterCount"
        :value="filterCount"
        overlap
        color="red"
        offset-x="20"
      >
        <CUIcon color="white" class="margin-r-2">filter</CUIcon>
      </v-badge>
      Filter
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import { Component, Watch, Vue, Model } from 'vue-property-decorator'
import { EventBus } from '@/utils/eventBus'

@Component
export default class CUDataTableFilterButton extends Vue {
  @Model('input') readonly value!: boolean | null
  @Watch('isFilterDialogOpen')
  isFilterDialogOpenChanged(value: boolean): void {
    this.$emit('input', value)
  }
  @Watch('value', { immediate: true })
  valueChanged(value: boolean): void {
    this.isFilterDialogOpen = value
  }

  isFilterDialogOpen = false
  filterCount = 0

  mounted(): void {
    EventBus.$on('add-filter', (e) => {
      this.filterCount++
    })

    EventBus.$on('remove-filter', (e) => {
      if (this.filterCount > 0) {
        this.filterCount--
      }
    })
  }
}
</script>
