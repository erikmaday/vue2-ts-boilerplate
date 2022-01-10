<template>
  <div>
    <v-row class="align-center margin-b-2">
      <v-col cols="auto">
        <span
          v-for="(tabFilter, tabFilterIndex) in tabFilters"
          :id="`data-table-table-filter-${tabFilter.column._t_id}-${tabFilter.column.text}-control-${tabFilterIndex}`"
          :key="`data-table-table-filter-${tabFilter.column._t_id}-${tabFilter.column.text}-control-${tabFilterIndex}`"
          class="
            margin-x-3
            padding-y-1
            font-14 font-medium
            text-gray-light
            border-t-0 border-x-0 border-b-2 border-solid border-transparent
            cursor-pointer
          "
          :class="{
            'text-primary border-primary': isColumnFilterActive(
              tabFilter.column
            ),
            'hover:border-gray-light': !isColumnFilterActive(tabFilter.column),
          }"
          @click="handleTabFilterClick(tabFilter)"
        >
          {{ tabFilter.column.text }}
        </span>
      </v-col>
      <slot name="filter-row" />
    </v-row>
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
  </div>
</template>

<script lang="ts">
import { DataTableColumn } from '@/models/DataTableColumn'
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import { EventBus } from '@/utils/eventBus'
import { TableViewFilter } from '@/models/TableView'

@Component
export default class CUDataTableFilters extends Vue {
  @Prop({
    type: Array,
    required: false,
    default: () => [],
  })
  columns!: DataTableColumn[]

  @Prop({ required: false, default: () => [] }) sorts!: any
  @Prop({ required: false, default: () => [] }) filters!: any
  @Prop({ required: false, default: () => [] })
  initialFilters!: TableViewFilter[]
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  open: boolean
  @PropSync('filterList', { type: Array, default: () => [] })
  tableFilterList!: any[]
  @Prop({ required: false, default: () => [] })
  tabFilters!: TableViewFilter[]

  @Watch('isOpen')
  isDialogOpenChanged(value: boolean): void {
    this.$emit('update:open', value)
  }
  @Watch('open', { immediate: true })
  valueChanged(value: boolean): void {
    this.isOpen = value
  }
  @Watch('currentSort', { deep: true })
  handleSortChanged(): void {
    this.refresh(true)
  }
  @Watch('initialFilters', { deep: true, immediate: true })
  handleInitialFiltersChanged(): void {
    this.setInitialFilters()
  }
  @Watch('tabFilters', { immediate: true })
  handleTabFiltersChanged(): void {
    this.selectDefaultTabFilter()
  }

  isOpen = false
  currentSort: any = {
    prop: undefined,
    direction: undefined,
  }
  debounce: any = null
  selectedFilter: string = undefined

  mounted(): void {
    this.initiateDefaultSort()
  }

  isColumnFilterActive(column: DataTableColumn): boolean {
    return !!this.findFilterByColumn(column)
  }

  isColumnSortActive(column: DataTableColumn): boolean {
    return this.currentSort.id === column._t_id
  }

  getColumnSortIcon(column: DataTableColumn): string {
    if (this.isColumnSortActive(column)) {
      if (this.currentSort.direction === 'asc') {
        return 'arrow_up'
      }
    }
    return 'arrow_down'
  }

  findFilterByColumn(column: DataTableColumn): any {
    return this.tableFilterList.find((f) => f.column._t_id === column._t_id)
  }

  async setInitialFilters(): Promise<void> {
    for (const initialFilter of this.initialFilters) {
      const hide = initialFilter?.hideOnFilterBar || false
      await this.setFilter(initialFilter.column, hide)
      this.updateFilterCriteria(initialFilter.value, initialFilter.column)
    }
    this.receiveFilters()
    this.handleFilterAdded()
    this.$emit('initial-filters-set')
  }

  receiveFilters(): void {
    this.$emit('update:filters', this.filters)
  }

  async setFilter(
    column: DataTableColumn,
    hideOnFilterBar = false
  ): Promise<void> {
    this.selectedFilter = column._t_id
    const doesFilterAlreadyExist = this.filters.find({ column })
    if (!doesFilterAlreadyExist) {
      const newFilter = { column }
      this.tableFilterList.push(newFilter)
      if (newFilter.column.method) {
        const grandParent = this.filters.createParent('and')
        const parent = this.filters.createParent('or', grandParent)
        this.filters.add(parent, newFilter)
        this.$emit('update:filters', this.filters)
      } else {
        this.filters.and(newFilter).add(newFilter)
        this.$emit('update:filters', this.filters)
      }
    }
  }

  unsetFilter(column: DataTableColumn): void {
    const filter = this.tableFilterList.find(
      (f) => f.column._t_id === column._t_id
    )
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
    this.$nextTick(() => {
      this.tableFilterList = this.tableFilterList.filter(
        (f) => f.column._t_id !== filter.column._t_id
      )
      const nextDefaultFilter = this.tableFilterList.find(
        (f) => !f.hideOnFilterBar
      )
      if (nextDefaultFilter && nextDefaultFilter.column) {
        this.setFilter(nextDefaultFilter.column)
      }
      this.handleFilterRemoved()
    })
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

  initiateDefaultSort(): void {
    const defaultSortColumn = this.columns.find((column) => column.defaultSort)
    if (defaultSortColumn) {
      this.initSort(defaultSortColumn)
    }
  }

  selectDefaultTabFilter(): void {
    const defaultFilter = this.tabFilters.find((filter) => filter.default)
    if (defaultFilter) {
      this.handleTabFilterClick(defaultFilter)
    }
  }

  handleTabFilterClick(tabFilter: TableViewFilter): void {
    if (this.isColumnFilterActive(tabFilter.column)) {
      const showAllTab = this.tabFilters.find((filter) => filter.isShowAll)
      if (showAllTab && showAllTab.column._t_id !== tabFilter.column._t_id) {
        this.setTabFilter(showAllTab)
      }
    } else {
      this.setTabFilter(tabFilter)
    }
  }

  setTabFilter(tabFilter: TableViewFilter): void {
    this.unsetAllTabFilters()
    this.setFilter(tabFilter.column)
    this.updateFilterCriteria(tabFilter.value, tabFilter.column)
  }

  unsetAllTabFilters(): void {
    for (const filter of this.tabFilters) {
      if (this.isColumnFilterActive(filter.column)) {
        this.unsetFilter(filter.column)
      }
    }
  }

  initSort(column: DataTableColumn): void {
    const sortProp = column.sortProp || column.value
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
    this.$emit('update:open', false)
  }
}
</script>
