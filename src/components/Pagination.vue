<template>
  <div class="d-inline-flex">
    <PaginationDot
      v-for="(page, pageIndex) in pagesCount"
      :key="`page-${pageIndex}`"
      :active="activeIndex === pageIndex"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :hover-color="hoverColor"
      @click="handlePageChange(page)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Watch, Vue } from 'vue-property-decorator'
import PaginationDot from '@/components/PaginationDot.vue'
import { PaginationParams } from '@/models/Pagination'
import deepClone from '@/utils/deepClone'

@Component({
  components: {
    PaginationDot,
  },
})
export default class Pagination extends Vue {
  @Model('change') readonly value!: PaginationParams
  @Prop() readonly items!: any[]
  @Prop({ default: 'primary' }) readonly activeColor?: string
  @Prop({ default: 'gray-mid-light' }) readonly hoverColor?: string
  @Prop({ default: 'gray-border' }) readonly inactiveColor?: string

  @Watch('breakpointName', { immediate: true })
  didBreakpointChange(breakpoint: string): void {
    if (this.value.breakpointSizes) {
      const newPageSize = this.value.breakpointSizes[`${breakpoint}`]
      const firstItemIndex = (this.value.currentPage - 1) * this.value.pageSize
      const newCurrentPage = Math.floor(firstItemIndex / newPageSize + 1)
      this.$emit('change', {
        pageSize: newPageSize,
        currentPage: newCurrentPage,
        breakpointSizes: this.value.breakpointSizes,
      })
    }
  }

  @Watch('items', { deep: true })
  didItemsChange(): void {
    this.$emit('change', {
      pageSize: this.value.pageSize,
      currentPage: 1,
      breakpointSizes: this.value.breakpointSizes,
    })
  }

  get pagesCount(): number {
    return Math.ceil(this.items.length / this.value.pageSize)
  }

  get breakpointName(): string {
    return this.$vuetify.breakpoint.name
  }

  get activeIndex(): number {
    return this.value.currentPage - 1
  }

  handlePageChange(page: number): void {
    const valueCopy = deepClone(this.value)
    valueCopy.currentPage = page
    this.$emit('change', valueCopy)
  }
}
</script>
