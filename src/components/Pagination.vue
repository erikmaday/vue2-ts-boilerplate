<template>
  <div class="d-inline-flex">
    <v-hover v-slot:default="{ hover }">
      <div>
        <button
          @click="previous"
          :hidden="allDotsAreVisible"
          :disabled="isFirstPage"
          class="mr-4 transition-all transition-duration-100"
        >
          <CUIcon
            :color="arrowColor(hover)"
            :class="{
              'text-transparent': isFirstPage,
            }"
          >
            arrow_left
          </CUIcon>
        </button>
      </div>
    </v-hover>
    <PaginationDot
      v-for="(page, dotIndex) in visibleItems"
      :key="`page-${page}-dot-${dotIndex}`"
      :active="value.currentPage === page"
      :active-color="activeColor"
      :color="color"
      :hover-color="hoverColor"
      @click="handlePageChange(page)"
    />
    <v-hover v-slot:default="{ hover }">
      <div>
        <button
          @click="next"
          :hidden="allDotsAreVisible"
          :disabled="isLastPage"
          class="ml-4 transition-all transition-duration-100"
        >
          <CUIcon
            :color="arrowColor(hover)"
            :class="{
              'text-transparent': isLastPage,
            }"
          >
            arrow_right
          </CUIcon>
        </button>
      </div>
    </v-hover>
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
  @Prop({ default: 'gray-border' }) readonly color?: string
  @Prop({ default: 5 }) readonly totalVisible?: number

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

  get allDotsAreVisible(): boolean {
    return this.pagesCount < this.totalVisible
  }

  get isFirstPage(): boolean {
    return this.value.currentPage === 1
  }

  get isLastPage(): boolean {
    return this.value.currentPage === this.pagesCount
  }

  get visibleItems(): (string | number)[] {
    /*
    a modified version of a function implemented in v-pagination from here:
    https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VPagination/VPagination.ts
    */
    if (this.allDotsAreVisible) {
      return this.range(1, this.pagesCount)
    }

    const currentPage = this.value.currentPage

    const even = this.totalVisible % 2 === 0 ? 1 : 0
    const left = Math.floor(this.totalVisible / 2)
    const right = this.pagesCount - left + 1 + even

    if (currentPage > left && currentPage < right) {
      const start = currentPage - left
      const end = currentPage + left - even

      return this.range(start, end)
    } else if (currentPage >= right) {
      const start = this.pagesCount - this.totalVisible + 1
      return this.range(start, this.pagesCount)
    } else {
      return this.range(1, this.totalVisible)
    }
  }

  range(from: number, to: number): number[] {
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

  arrowColor(hover: boolean): string {
    if (hover) {
      return this.hoverColor
    }
    return this.color
  }
}
</script>
