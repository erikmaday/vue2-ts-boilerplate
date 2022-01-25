<template>
  <div>
    <v-row class="align-center margin-b-2">
      <v-col cols="auto">
        <span
          v-for="(tab, tabIndex) in tabs"
          :id="`data-table-tab-${tab.column._t_id}-${tab.column.text}-control-${tabIndex}`"
          :key="`data-table-tab-${tab.column._t_id}-${tab.column.text}-control-${tabIndex}`"
          class="margin-x-3 padding-y-1 font-14 font-medium text-gray-light border-t-0 border-x-0 border-b-2 border-solid"
          :class="{
            'text-primary border-primary': isTabActive(tab),
            'border-transparent hover:border-gray-light':
              !isTabActive(tab) && !tab.isLocked,
            'cursor-pointer': !tab.isLocked,
            'text-gray-mid-light cursor-default border-transparent':
              tab.isLocked,
          }"
          @click="handleTabClick(tab)"
        >
          {{ tab.column.text }}
          <CUIcon
            v-if="tab.isLocked"
            width="14px"
            height="14px"
            style="margin-bottom: -2px"
          >
            lock_outlined
          </CUIcon>
        </span>
      </v-col>
      <slot name="filter-row" />
    </v-row>
    <CUModal v-model="isOpen">
      <template #title>Filter</template>
      <template #text>
        <v-row v-if="chips.length">
          <v-col cols="12">
            <v-chip
              v-for="(chip, chipIndex) in chips"
              :key="`${chip.text}-${chipIndex}`"
              :outlined="!isFilterActive(chip)"
              color="primary"
              class="margin-r-2 last-of-type:margin-r-0"
              @click="setChipFilter(chip)"
            >
              {{ chip.text }}
            </v-chip>
          </v-col>
        </v-row>
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
                v-if="column.filterable && !isFilterActive(column)"
                class="cursor-pointer text-gray-mid-light hover:text-gray-light"
                :key="`${column.text}-${columnIndex}-filter-activate`"
                @click="setFilter(column)"
              >
                search
              </CUIcon>
              <template v-if="column.filterable && isFilterActive(column)">
                <CUIcon
                  v-if="column.predefined"
                  class="cursor-pointer text-gray-mid-light hover:text-gray-light"
                  :key="`${column.text}-${columnIndex}-filter-deactivate`"
                  @click="unsetPredefinedFilter(column)"
                >
                  close
                </CUIcon>
                <CUIcon
                  v-if="!column.predefined"
                  class="cursor-pointer text-gray-mid-light hover:text-gray-light"
                  :key="`${column.text}-${columnIndex}-filter-deactivate`"
                  @click="unsetFilter(column)"
                >
                  close
                </CUIcon>
              </template>
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
                v-if="column.predefined && isFilterActive(column)"
                cols="12"
              >
                <v-chip
                  v-for="(
                    predefinedFilter, predefinedFilterIndex
                  ) in column.predefined"
                  :outlined="!predefinedFilter.active"
                  :key="predefinedFilterIndex"
                  color="primary"
                  class="margin-r-2 margin-b-2"
                  @click="selectPredefined(column, predefinedFilter)"
                >
                  {{ predefinedFilter.text }}
                </v-chip>
              </v-col>
            </v-expand-transition>
            <v-expand-transition>
              <v-col
                v-if="column.filterable && isFilterActive(column)"
                cols="12"
                class="padding-t-0"
              >
                <div>
                  <v-row
                    v-if="
                      column.predefined &&
                      isFilterActive(column) &&
                      activePredefinedFilter(column) &&
                      activePredefinedFilter(column).selectedPredefined
                    "
                  >
                    <v-col
                      cols="6"
                      v-for="(control, controlIndex) in activePredefinedFilter(
                        column
                      ).selectedPredefined.controls"
                      :key="`${controlIndex}-${column._t_id}-${control.text}-col`"
                    >
                      <label class="font-14">
                        {{ control.text }}
                      </label>
                      <CUDatePicker
                        :key="`${controlIndex}-${column._t_id}-${control.text}`"
                        :value="control.value"
                        @input="
                          (event) =>
                            handleDatePickerInput(event, column, controlIndex)
                        "
                      />
                    </v-col>
                  </v-row>
                  <CUTextField
                    v-if="!column.predefined"
                    hide-details
                    clearable
                    @input="updateFilterCriteria($event, column._t_id)"
                  />
                </div>
              </v-col>
            </v-expand-transition>
          </v-row>
        </template>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" small text @click="clear">Clear</v-btn>
        <v-btn color="primary" small @click="close">Close</v-btn>
      </template>
    </CUModal>
  </div>
</template>

<script lang="ts">
import { DataTableColumn } from '@/models/DataTableColumn'
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import { calculatedValues } from '@/data/predefined'
import { EventBus } from '@/utils/eventBus'
import deepPluckRef from 'deep-pluck-ref'
import {
  PredefinedFilter,
  TableViewChip,
  TableViewFilter,
  TableViewTab,
} from '@/models/TableView'

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
  tabs!: TableViewTab[]
  @Prop({ required: false, default: () => [] })
  chips!: TableViewChip[]

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
  @Watch('tabs', { immediate: true })
  handleTabsChanged(): void {
    this.selectDefaultTab()
  }

  isOpen = false
  currentSort: any = {
    prop: undefined,
    direction: undefined,
  }
  debounce: any = null
  activePredefinedFilters = []

  mounted(): void {
    for (const column of this.columns) {
      if (column?.predefined) {
        for (const p of column.predefined) {
          p.active = false
        }
      }
    }
    this.initiateDefaultSort()
  }

  activePredefinedFilter(column: any): any {
    return this.activePredefinedFilters.find(
      (pf) => pf.column._t_id === column._t_id
    )
  }

  isTabActive(tab: TableViewTab): boolean {
    if (tab.column.sortProp) {
      return this.isColumnSortActive(tab.column)
    } else {
      return this.isFilterActive(tab.column)
    }
  }

  isFilterActive(
    filter: DataTableColumn | PredefinedFilter | TableViewChip
  ): boolean {
    return !!this.findFilterById(filter._t_id)
  }

  isColumnSortActive(column: DataTableColumn): boolean {
    return this.currentSort.id === column._t_id
  }

  getFilterByColumn(column: DataTableColumn): any {
    return (
      this.tableFilterList.find((f: any) => f.column?._t_id === column._t_id) ||
      {}
    )
  }

  getColumnSortIcon(column: DataTableColumn): string {
    if (this.isColumnSortActive(column)) {
      if (this.currentSort.direction === 'asc') {
        return 'arrow_up'
      }
    }
    return 'arrow_down'
  }

  findFilterById(_t_id: string): any {
    return this.tableFilterList.find((f) => f.column._t_id === _t_id)
  }

  async setInitialFilters(): Promise<void> {
    for (const initialFilter of this.initialFilters) {
      const hide = initialFilter?.hideOnFilterBar || false
      await this.setFilter(initialFilter.column, hide)
      this.updateFilterCriteria(initialFilter.value, initialFilter.column._t_id)
    }
    this.receiveFilters()
    this.handleFilterAdded()
    this.$emit('initial-filters-set')
  }

  receiveFilters(): void {
    this.$emit('update:filters', this.filters)
  }

  async selectPredefined(
    column: DataTableColumn,
    predefinedFilter: PredefinedFilter
  ): Promise<void> {
    for (const predefined of column.predefined) {
      predefined.active = predefined._t_id === column._t_id
    }
    const filter = this.tableFilterList.find(
      (f: any) => f.column?._t_id === column._t_id
    )
    predefinedFilter.active = true
    if (!predefinedFilter.id) {
      predefinedFilter.id = uuidv4()
    }
    const currentSelectedPredefinedId = filter?.selectedPredefined?.id
    if (currentSelectedPredefinedId !== predefinedFilter.id) {
      this.unsetPeerFilters(filter)
    }
    filter.selectedPredefined = predefinedFilter
    const valueRefs = deepPluckRef(predefinedFilter, ['value'])
    for (const valueRef of valueRefs) {
      if (typeof valueRef !== 'object') {
        continue
      }
      const calculationFunction =
        calculatedValues?.[valueRef.recalculate || valueRef.value]
      if (typeof calculationFunction === 'function') {
        valueRef.value = await calculationFunction()
        valueRef.displayValue = this.$dayjs(valueRef.value).format('YYYY-MM-DD')
      }
    }
    const findActiveFilter = this.activePredefinedFilters.find(
      (pf) => pf.parent == filter.parent
    )
    if (findActiveFilter) {
      this.activePredefinedFilters.splice(
        this.activePredefinedFilters.indexOf(findActiveFilter),
        1
      )
    }
    this.activePredefinedFilters.push(filter)
    if (predefinedFilter.refreshOnSelect) {
      this.handleFilterAdded()
    }
  }

  setChipFilter(chip: TableViewChip): void {
    const exists = !!this.isFilterActive(chip)

    if (!exists) {
      const filterParentAnd = this.filters.createParent('and')
      for (const value of chip.values) {
        this.filters.add(filterParentAnd, value)
      }
      this.tableFilterList.push({ column: { ...chip } })
      this.handleFilterAdded()
      EventBus.$emit('add-filter')
    } else {
      this.unsetChipFilter(chip)
    }
  }

  unsetChipFilter(chip: TableViewChip): void {
    this.unsetChipChildFilters(chip)
    this.unsetFilter(chip)
  }

  unsetChipChildFilters(chip: TableViewChip): void {
    const chipFilter = this.tableFilterList.find(
      (f) => f.column._t_id === chip._t_id
    )
    if (!chipFilter) {
      return
    }
    for (const filter of chipFilter.column.values) {
      this.filters.remove(filter)
      this.$emit('update:filters', this.filters)
    }
  }

  async setFilter(
    column: DataTableColumn,
    hideOnFilterBar = false
  ): Promise<void> {
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
      if (this.isOpen) {
        EventBus.$emit('add-filter')
      }
    }
  }

  unsetFilter(column: DataTableColumn | TableViewChip): void {
    const filter = this.tableFilterList.find(
      (f) => f.column._t_id === column._t_id
    )
    if (!filter) {
      return
    }
    if (this.activePredefinedFilters) {
      const activeFilter = this.activePredefinedFilters.find(
        (pf) => pf?.column?._t_id === column._t_id
      )
      if (activeFilter) {
        this.activePredefinedFilters.splice(
          this.activePredefinedFilters.indexOf(activeFilter),
          1
        )
      }
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
    if (this.isOpen) {
      EventBus.$emit('remove-filter')
    }
    this.$emit('update:filters', this.filters)
    this.$nextTick(() => {
      this.tableFilterList = this.tableFilterList.filter(
        (f) => f.column._t_id !== filter.column._t_id
      )
      // This functionality is not needed at this time and causes issues with removing filters
      // const nextDefaultFilter = this.tableFilterList.find(
      //   (f) => !f.hideOnFilterBar
      // )
      // if (nextDefaultFilter && nextDefaultFilter.column) {
      //   this.setFilter(nextDefaultFilter.column)
      // }
      this.handleFilterRemoved()
    })
  }

  unsetPredefinedFilter(column: DataTableColumn): void {
    for (const c of column?.predefined) {
      c.active = false
    }
    this.unsetFilter(column)
  }

  unsetPeerFilters(filter: any): void {
    const unset = filter?.column?.unset || []
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

  updateFilterCriteria(filterValue: any, _t_id: string): void {
    const matchingFilter = this.findFilterById(_t_id)
    if (matchingFilter) {
      if (filterValue?.target) {
        matchingFilter.value = filterValue?.target?.value
      } else {
        matchingFilter.value = filterValue
      }
    }
    this.handleFilterAdded()
  }

  handleDatePickerInput(
    event: any,
    column: DataTableColumn,
    controlIndex: number
  ): void {
    const timestamp = this.$dayjs(event).format('YYYY-MM-DD')
    this.updateMultiValueFilterCriteria(timestamp, column, controlIndex)
  }

  updateMultiValueFilterCriteria(
    filterValue: any,
    column: DataTableColumn,
    index: number
  ): void {
    const value =
      filterValue && filterValue.target ? filterValue.target.value : filterValue
    const columnFilter = this.getFilterByColumn(column)
    const { selectedPredefined } = columnFilter
    selectedPredefined.controls[index].value = value
    if (columnFilter.column.type === 'date') {
      const formattedDateValue = this.$dayjs(value).format('YYY-MM-DD')
      selectedPredefined.controls[index].displayValue = formattedDateValue
    }
    this.handleFilterAdded()
    this.initSort(column)
  }

  initiateDefaultSort(): void {
    const defaultSortColumn = this.columns.find((column) => column.defaultSort)
    if (defaultSortColumn) {
      this.initSort(defaultSortColumn)
    }
  }

  selectDefaultTab(): void {
    const defaultTab = this.tabs.find((tab) => tab.default)
    if (defaultTab) {
      this.handleTabClick(defaultTab)
    }
  }

  handleTabClick(tab: TableViewTab): void {
    if (tab.isLocked) {
      return
    }
    if (tab.column.sortProp) {
      if (this.isColumnSortActive(tab.column)) {
        const showAllTab = this.tabs.find((t) => t.isShowAll)
        if (showAllTab) {
          this.setTabFilter(showAllTab)
        }
        this.initiateDefaultSort()
      } else {
        this.unsetAllTabs()
        this.initSort(tab.column)
      }

      return
    }

    if (this.isFilterActive(tab.column)) {
      const showAllTab = this.tabs.find((t) => t.isShowAll)
      if (showAllTab && showAllTab.column._t_id !== tab.column._t_id) {
        this.setTabFilter(showAllTab)
      }
    } else {
      this.setTabFilter(tab)
    }
  }

  setTabFilter(tab: TableViewTab): void {
    this.unsetAllTabs()
    this.setFilter(tab.column)
    this.updateFilterCriteria(tab.value, tab.column._t_id)
  }

  unsetAllTabs(): void {
    for (const tab of this.tabs) {
      if (tab.column.sortProp) {
        if (this.isColumnSortActive(tab.column)) {
          this.sorts.remove()
          this.currentSort = {}
          this.$emit('update:sorts', this.sorts)
        }
      } else if (this.isFilterActive(tab.column)) {
        this.unsetFilter(tab.column)
      }
    }
  }

  isTabFilter(filter: TableViewFilter): boolean {
    return !!this.tabs.find((tab) => tab.column._t_id === filter.column._t_id)
  }

  isInitialFilter(filter: TableViewFilter): boolean {
    return !!this.initialFilters.find(
      (initialFilter) => initialFilter.column._t_id === filter.column._t_id
    )
  }

  initSort(column: DataTableColumn): void {
    const sortProp = column.sortProp || column.value
    this.currentSort.key = uuidv4()
    if (this.currentSort && this.currentSort.prop === sortProp) {
      if (this.currentSort.direction === 'desc') {
        this.currentSort.direction = 'asc'
      } else if (this.currentSort.direction === 'asc') {
        this.clearSorts()
      } else {
        this.currentSort.direction = 'desc'
      }
      this.sorts.add(this.currentSort)
      this.$emit('update:sorts', this.sorts)
      return
    }
    this.currentSort = {
      key: uuidv4(),
      id: column._t_id,
      prop: sortProp,
      direction: column.sortDirection || 'desc',
    }
    this.sorts.add(this.currentSort)
    this.$emit('update:sorts', this.sorts)
  }

  clearSorts(): void {
    this.sorts.remove()
    this.currentSort = {
      prop: undefined,
      direction: undefined,
    }
    this.initiateDefaultSort()
  }

  clearAddedFilters(): void {
    let initialFilterList = []
    for (const filter of this.tableFilterList) {
      const isInitialFilter = this.isInitialFilter(filter)
      const isCurrentTab = this.isTabFilter(filter)
      if (isInitialFilter || isCurrentTab) {
        initialFilterList.push(filter)
      } else {
        this.unsetFilter(filter.column)
      }
    }
    for (const chip of this.chips) {
      this.unsetChipFilter(chip)
    }
    this.tableFilterList = initialFilterList
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

  clear(): void {
    this.clearSorts()
    this.clearAddedFilters()

    this.close()
  }

  close(): void {
    this.$emit('update:open', false)
  }
}
</script>
