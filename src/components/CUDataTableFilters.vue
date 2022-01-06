<template>
  <CUModal v-model="isOpen">
    <template #title>Filter</template>
    <template #text>
      <template v-for="(column, columnIndex) in columns">
        <v-row
          v-if="column.filterable || column.sortable"
          :key="`${column.text}-${columnIndex}`"
          wrap
        >
          <v-col class="shrink white-space-nowrap padding-r-0 margin-r-2">
            <h3>{{ column.text }}</h3>
          </v-col>
          <v-col class="shrink padding-x-0 margin-r-1">
            <CUIcon
              v-if="column.filterable && !isColumnFilterActive(column)"
              class="cursor-pointer text-gray-mid-light hover:text-gray-light"
              :key="`${column.text}-${columnIndex}-filter-activate`"
              @click="setFilter(column)"
            >
              search
            </CUIcon>
            <CUIcon
              v-if="column.filterable && isColumnFilterActive(column)"
              class="cursor-pointer text-gray-mid-light hover:text-gray-light"
              :key="`${column.text}-${columnIndex}-filter-deactivate`"
              @click="unsetFilter(column)"
            >
              close
            </CUIcon>
          </v-col>
          <v-col class="shrink padding-x-0">
            <CUIcon
              v-if="column.sortable"
              class="cursor-pointer transition-all transition-250"
              :class="{
                'text-gray-mid-light hover:text-gray-light':
                  !isColumnSortActive(column),
                'text-primary': isColumnSortActive(column),
              }"
              :key="`sort-icon-${getColumnSortIcon(column)}`"
              @click="initSort(column)"
            >
              {{ getColumnSortIcon(column) }}
            </CUIcon>
          </v-col>
          <v-expand-transition>
            <v-col
              v-if="column.filterable && isColumnFilterActive(column)"
              cols="12"
              class="padding-t-0"
            >
              <CUTextField
                hide-details
                clearable
                @input="updateFilterCriteria($event, column)"
              />
            </v-col>
          </v-expand-transition>
        </v-row>
      </template>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn color="primary" small text @click="close">Cancel</v-btn>
      <v-btn color="primary" small @click="close">Save</v-btn>
    </template>
  </CUModal>
</template>

<script lang="ts">
import { DataTableColumn } from '@/models/DataTableColumn'
import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import { EventBus } from '@/utils/eventBus'

@Component
export default class CUDataTableFilters extends Vue {
  @Model('input') readonly value!: boolean
  @Prop({
    type: Array,
    required: false,
    default: () => [],
  })
  columns!: DataTableColumn[]

  @Prop({ required: false, default: () => [] }) sorts!: any
  @Prop({ required: false, default: () => [] }) filters!: any

  @Watch('isOpen')
  isDialogOpenChanged(value: boolean): void {
    this.$emit('input', value)
  }
  @Watch('value', { immediate: true })
  valueChanged(value: boolean): void {
    this.isOpen = value
  }
  @Watch('currentSort', { deep: true })
  handleSortChanged(): void {
    this.refresh(true)
  }

  isOpen = false
  filterList = []
  currentSort: any = {
    prop: undefined,
    direction: undefined,
  }
  debounce: any = null

  isColumnFilterActive(column: DataTableColumn): boolean {
    return !!this.findFilterByColumn(column)
  }

  isColumnSortActive(column: DataTableColumn): boolean {
    return this.currentSort.id === column._t_id
  }

  getColumnSortIcon(column: DataTableColumn): boolean {
    if (this.isColumnSortActive(column)) {
      if (this.currentSort.direction === 'asc') {
        return 'arrow_up'
      }
    }
    return 'arrow_down'
  }

  findFilterByColumn(column: DataTableColumn): any {
    return this.filterList.find((f) => f.column._t_id === column._t_id)
  }

  setFilter(column: DataTableColumn): void {
    const doesFilterAlreadyExist = this.filters.find({ column })
    if (!doesFilterAlreadyExist) {
      const newFilter = { column }
      this.filterList.push(newFilter)
      const activeFilter = newFilter
      if (activeFilter.column.method) {
        const grandParent = this.filters.createParent('and')
        const parent = this.filters.createParent('or', grandParent)
        this.filters.add(parent, activeFilter)
        this.$emit('update:filters', this.filters)
      } else {
        this.filters.and(activeFilter).add(activeFilter)
        this.$emit('update:filters', this.filters)
      }
      // LEAVE FOR NOW, WILL LIKELY UNCOMMENT WHEN WE ADD PREDEFINED FILTERS SHORTLY
      // if (column.recalculate) {
      //   newFilter.recalculate = column.recalculate
      // }
      // if (column.predefined && Array.isArray(column.predefined)) {
      //   const defaultPredefined = column.predefined.find(
      //     (predefined) => predefined.defaultOnSelection
      //   )
      //   if (defaultPredefined) {
      //     await this.selectPredefined(defaultPredefined)
      //   }
      // }
      // if (column.defaultValue) {
      //   const calculationFunction = this.calculatedValues[column.defaultValue]
      //   if (typeof calculationFunction === 'function') {
      //     newFilter.value = await calculationFunction()
      //   } else {
      //     newFilter.value = column.defaultValue
      //   }
      //   this.addFilter()
      // }
    }
  }

  unsetFilter(column: DataTableColumn): void {
    const filter = this.filterList.find((f) => f.column._t_id === column._t_id)
    if (!filter) {
      return
    }
    for (const f of this.filters.parents()) {
      for (const c of this.filters.children(f)) {
        if (filter.column._t_id === c.stepParent) {
          this.filters.remove(c)
          this.$emit('update:filters', this.filters)
        }
      }
    }
    this.unsetPeerFilters(filter)
    this.filters.remove(filter)
    this.$emit('update:filters', this.filters)
    setTimeout(() => {
      this.filterList = this.filterList.filter(
        (f) => f.column._t_id !== filter.column._t_id
      )
      const nextDefaultFilter = this.filterList.find((f) => !f.hideOnFilterBar)
      if (nextDefaultFilter && nextDefaultFilter.column) {
        this.setFilter({}, nextDefaultFilter.column)
      }
      this.handleFilterRemoved()
    }, 0)
  }

  unsetPeerFilters(filter: any): void {
    const { unset = [] } = filter.column
    unset.forEach((unsetFilterId) => {
      const foundColumn = this.columns.find(
        (column) => column._t_id === unsetFilterId
      )
      if (foundColumn) {
        const foundFilter = this.filters.find({ column: foundColumn })
        if (foundFilter) {
          this.filters.remove(foundFilter)
          this.$emit('update:filters', this.filters)
        }
      }
    })
  }

  updateFilterCriteria(filterValue: any, column: DataTableColumn): void {
    const activeFilter = this.findFilterByColumn(column)
    if (filterValue?.target) {
      activeFilter.value = filterValue?.target?.value
    } else {
      activeFilter.value = filterValue
    }
    this.handleFilterAdded()
  }

  initSort(column: DataTableColumn): void {
    const sortProp = column.sortProp || column.prop
    this.currentSort.key = uuidv4()
    if (this.currentSort && this.currentSort.prop === sortProp) {
      this.currentSort.direction =
        this.currentSort.direction === 'desc' ? 'asc' : 'desc'
      this.sorts.add(this.currentSort)
      this.$emit('update:sorts', this.sorts)
      return
    }
    this.currentSort = {
      key: uuidv4(),
      id: column._t_id,
      prop: sortProp,
      direction: 'desc',
    }
    this.sorts.add(this.currentSort)
    this.$emit('update:sorts', this.sorts)
  }

  handleFilterAdded(): void {
    this.resetPage()
    this.refresh(false)
  }

  handleFilterRemoved(): void {
    this.resetPage()
    this.refresh(true)
  }

  resetPage(): void {
    EventBus.$emit('set-tableview-page', 1)
  }

  refresh(immediate = false): void {
    if (this.debounce) {
      clearTimeout(this.debounce)
    }
    if (immediate) {
      EventBus.$emit('refresh-tableview')
    } else {
      this.debounce = setTimeout(() => EventBus.$emit('refresh-tableview'), 500)
    }
  }

  close(): void {
    this.$emit('input', false)
  }
}
</script>
