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
          'border-width-1 border-style-1 border-color-gray-border':
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
      <!-- <div
        :class="`cv-item ` + value.classes.join(' ')"
        class="h-80 background-accent padding-a-0"
        :style="`border: none; top: ${value.originalItem.startingHeight}px`"
      >
        <p>{{ value.originalItem.reservationId }}</p>
        <p>{{ `${value.originalItem.firstStop} > ${value.originalItem.lastStop}` }} </p> 
      </div> -->
    </template>
  </CalendarView>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { CalendarView } from 'vue-simple-calendar'
import dayjs from 'dayjs'
import AvailabilityCalendarItem from '@/components/AvailabilityCalendarItem.vue'
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
  items!: any

  @Prop({
    required: false,
    default: 600,
    type: Number,
  })
  minHeight!: number

  getDateOfHeaderDate(index: number): dayjs.Dayjs {
    if (index >= this.startingDayOfWeek) {
      return dayjs(this.showDate).add(index - this.startingDayOfWeek, 'day')
    } else {
      return dayjs(this.showDate).add(Number(7 - this.startingDayOfWeek + Number(index)), 'day')
    }
  }

  getDayHeaderDate(index: number): number {
    return this.getDateOfHeaderDate(index).date()
    // const firstDayWeekday = this.startingDayOfWeek
    // if (index >= this.startingDayOfWeek) {
    //   return dayjs(this.showDate).add(index - this.startingDayOfWeek, 'day').date()
    // } else {
    //   return dayjs(this.showDate).add(Number(7 - this.startingDayOfWeek + Number(index)), 'day').date()
    // }
  }

  isHeaderBold(index: number) {
    
    const headerDate = this.getDateOfHeaderDate(index)
    if (headerDate.isSame(dayjs(this.showDate), 'day')) return true 
    return false
  }

  get cssVars(): Record<string, string | number> {
    const minHeight = Math.max(this.minHeight, 100)
    let cssVars = {
      '--min-calendar-height': `${minHeight}px`,
    }
    return cssVars
  }

  get startingDayOfWeek() {
    return dayjs(this.showDate).day()
  }

  get dateClasses(): Record<string, any> {
    const showDateISO = dayjs(this.showDate).format('YYYY-MM-DD')
    return {
      [showDateISO]: 'bolded'
    }
  }

 
}
</script>
<style lang="scss" scoped>
.cv-wrapper {
  .cv-week-day-header {
    padding: 2px 8px;
    flex-basis: calc(100% / 7);
    border-right: 1px solid $gray-border;

    p {
      margin: 0;
      font-size: 14px;
    }

    &--bold {
      margin-left: -1px;
      flex-basis: calc((100% / 7) + 1px);
      font-weight: bolder;
      background: $gray-border;
    }
  }
}

::v-deep .cv-day-number {
  display: none;
}

::v-deep .cv-day.bolded {
  background: $gray-border;
}

::v-deep .cv-weeks {
  min-height: calc(var(--min-calendar-height) + 1px);
  overflow-y: hidden;
}

::v-deep .cv-item {
  background: transparent;
}

::v-deep .cv-day {
  border-color: $gray-border;
}
</style>
