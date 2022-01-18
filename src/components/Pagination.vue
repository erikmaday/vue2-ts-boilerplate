<template>
  <div class="d-inline-flex">
    <button
      @click="previous"
      :hidden="pagesCount <= totalVisible"
      type="button"
      :disabled="value.currentPage <= 1"
    >
      <CUIcon>arrow_left</CUIcon>
    </button>
    <PaginationDot
      v-for="(page, pageIndex) in visibleItems"
      :key="`page-${page}-${pageIndex}`"
      :active="value.currentPage === page"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :hover-color="hoverColor"
      @click="handlePageChange(page)"
    />
    <button
      @click="next"
      :hidden="pagesCount <= totalVisible"
      type="button"
      :disabled="value.currentPage === pagesCount"
    >
      <CUIcon>arrow_right</CUIcon>
    </button>
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
  @Prop({ default: 5 }) readonly totalVisible?: number

  maxButtons = 0
  selected = null

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

  get visibleItems(): (string | number)[] {
    /* a modified version of a function implemented in v-pagination from here: https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VPagination/VPagination.ts */
    if (this.pagesCount <= this.totalVisible) {
      return this.range({ from: 1, to: this.pagesCount })
    }

    const even = this.totalVisible % 2 === 0 ? 1 : 0
    const left = Math.floor(this.totalVisible / 2)
    const right = this.pagesCount - left + 1 + even

    if (this.value.currentPage > left && this.value.currentPage < right) {
      const start = this.value.currentPage - left
      const end = this.value.currentPage + left - even

      return this.range({ from: start, to: end })
    } else if (this.value.currentPage >= right) {
      const start = this.pagesCount - this.totalVisible + 1
      return this.range({ from: start, to: this.pagesCount })
    } else {
      return this.range({ from: 1, to: this.totalVisible })
    }
  }

  range({ from, to }: { from: number; to: number }): number[] {
    const range = []

    from = from > 0 ? from : 1

    for (let i = from; i <= to; i++) {
      range.push(i)
    }

    return range
  }

  handlePageChange(page: number): void {
    const valueCopy = deepClone(this.value)
    valueCopy.currentPage = page
    this.$emit('change', valueCopy)
  }

  next(): void {
    this.handlePageChange(this.value.currentPage + 1)
  }
  previous(): void {
    this.handlePageChange(this.value.currentPage - 1)
  }
}
</script>
