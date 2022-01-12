<template>
  <CalendarView
    :style="cssVars"
    :show-date="showDate"
    :starting-day-of-week="startingDayOfWeek"
    display-period-uom="week"
    :date-classes="dateClasses"
    :items="items"
  >
    <template #dayHeader="{ index, label }">
      <div
        class="cv-week-day-header"
        :class="{
          'border-width-1 border-style-1 border-color-gray-header':
            isHeaderBold(index.charAt(3)),
          'cv-week-day-header--bold': isHeaderBold(index.charAt(3)),
        }"
      >
        <p class="margin-a-0">{{ label }}</p>
        <p class="margin-a-0">{{ getDayHeaderDate(index.charAt(3), label) }}</p>
      </div>
    </template>
    <template #item="{ value }">
      <AvailabilityCalendarItem
        :item="value.originalItem"
        :classes="value.classes"
        :top="value.originalItem.top"
      />
    </template>
  </CalendarView>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { CalendarView } from 'vue-simple-calendar'
import dayjs from 'dayjs'
import AvailabilityCalendarItem from '@/components/AvailabilityCalendarItem.vue'
import { AvailabilityBlock } from '@/models/dto/Availability'
import { DAYS_IN_WEEK } from '@/utils/time'
@Component({
  components: { CalendarView, AvailabilityCalendarItem },
})
export default class AvailabilityCalendar extends Vue {
  @Prop({
    required: true,
    type: Date,
  })
  showDate!: Date

  @Prop({
    required: true,
  })
  items!: AvailabilityBlock[]

  @Prop({
    required: false,
    default: 600,
    type: Number,
  })
  minHeight!: number

  getDateOfHeaderDate(index: number | string): dayjs.Dayjs {
    index = Number(index)
    if (index >= this.startingDayOfWeek) {
      return dayjs(this.showDate).add(index - this.startingDayOfWeek, 'day')
    } else {
      return dayjs(this.showDate).add(
        Number(DAYS_IN_WEEK - this.startingDayOfWeek + index),
        'day'
      )
    }
  }

  getDayHeaderDate(index: number): number {
    return this.getDateOfHeaderDate(index).date()
  }

  isHeaderBold(index: number): boolean {
    const headerDate = this.getDateOfHeaderDate(index)
    return headerDate.isSame(dayjs(this.showDate), 'day')
  }

  get cssVars(): Record<string, string | number> {
    const minHeight = Math.max(this.minHeight, 60)
    let cssVars = {
      '--min-calendar-height': `${minHeight}px`,
    }
    return cssVars
  }

  get startingDayOfWeek(): number {
    return dayjs(this.showDate).day()
  }

  // Set the background of the current displayed calendar day to 
  // gray
  get dateClasses(): Record<string, string> {
    const showDateISO = dayjs(this.showDate).format('YYYY-MM-DD')
    return {
      [showDateISO]: 'bolded',
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .cv-weeks {
  min-height: calc(var(--min-calendar-height) + 1px);
  overflow-y: hidden;
}
</style>
