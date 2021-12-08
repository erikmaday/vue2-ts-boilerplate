<template>
  <div class="d-inline-flex">
    <CUIcon
      v-for="(page, pageIndex) in pagesCount"
      :key="`page-${pageIndex}`"
      class="
        text-gray-border
        cursor-pointer
        transition-all transition-duration-100
      "
      :class="{
        'text-primary': pageIndex === activeIndex,
        'hover:text-gray-mid-light': pageIndex !== activeIndex,
      }"
      @click="handlePageChange(page)"
    >
      dot
    </CUIcon>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Watch, Vue } from 'vue-property-decorator'
import CUIcon from '@/components/CUIcon.vue'
import { Pagination, PaginationBreakpoints } from '@/models/Pagination'

@Component({
  components: {
    CUIcon,
  },
})
export default class BookingCard extends Vue {
  @Model('change') readonly value!: Pagination
  @Prop({ required: false }) readonly breakpointSizes!: PaginationBreakpoints
  @Prop() readonly items!: any[]

  @Watch('breakpointName', { immediate: true })
  didBreakpointChange(breakpoint: string): void {
    if (this.breakpointSizes) {
      const newPageSize = this.breakpointSizes[`${breakpoint}`]
      const newCurrentPage = Math.floor(
        (this.value.currentPage * this.value.pageSize) / newPageSize
      )
      this.$emit('change', {
        pageSize: newPageSize,
        currentPage: newCurrentPage,
      })
    }
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
    const valueCopy = JSON.parse(JSON.stringify(this.value))
    valueCopy.currentPage = page
    this.$emit('change', valueCopy)
  }
}
</script>
