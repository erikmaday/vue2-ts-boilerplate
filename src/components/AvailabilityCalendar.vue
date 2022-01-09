<template>
  <CalendarView :style="cssVars" :show-date="showDate" display-period-uom="week" :items="items">
    <template #dayHeader="{ index, label }">
      <div
        class="cv-week-day-header"
        :class="{
          'background-gray-border border-width-1 border-style-1 border-color-gray-border':
            isHeaderToday(index.charAt(3)),
          'cv-week-day-header--today': isHeaderToday(index.charAt(3)),
        }"
      >
        <p class="margin-a-0">{{ label }}</p>
        <p class="margin-a-0">{{ getDayHeaderDate(index.charAt(3)) }}</p>
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

  getDayHeaderDate(index: number): number {
    return dayjs(this.showDate).startOf('week').add(index, 'day').date()
  }

  isHeaderToday(index: number) {
    const headerDate = dayjs(this.showDate).startOf('week').add(index, 'day')
    return dayjs().isSame(headerDate, 'day')
  }

  get cssVars(): Record<string, string | number> {
    const minHeight = Math.max(this.minHeight, 600)
    let cssVars = {
      '--min-calendar-height': `${minHeight}px`,
    }
    return cssVars
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

    &--today {
      margin-left: -1px;
      flex-basis: calc((100% / 7) + 1px);
      font-weight: bolder;
    }
  }
}

::v-deep .cv-day-number {
  display: none;
}

::v-deep .cv-day.today {
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
