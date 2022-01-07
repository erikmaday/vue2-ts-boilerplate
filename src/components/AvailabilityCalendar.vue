<template>
  <CalendarView :show-date="showDate" display-period-uom="week">
    <template #dayHeader="{ index, label }">
      <div
        class="cv-week-day-header"
        style="flex-basis: calc(100% / 7)"
        :class="{
          'background-gray-lighter border-width-1 border-style-1 border-color-gray-lighter':
            isHeaderToday(index.charAt(3)),
        }"
      >
        <p>{{ label }}</p>
        <p>{{ getDayHeaderDate(index.charAt(3)) }}</p>
      </div>
    </template>
  </CalendarView>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { CalendarView } from 'vue-simple-calendar'
import dayjs from 'dayjs'
@Component({
  components: { CalendarView },
})
export default class AvailabilityCalendar extends Vue {
  @Prop({
    required: true,
    type: Date,
  })
  showDate!: Date

  getDayHeaderDate(index: number): number {
    return dayjs(this.showDate).startOf('week').add(index, 'day').date()
  }

  isHeaderToday(index: number) {
    const headerDate = dayjs(this.showDate).startOf('week').add(index, 'day')
    return dayjs().isSame(headerDate, 'day')
  }
}
</script>
<style lang="scss" scoped>
.cv-wrapper {
  .cv-week-day-header {
    padding: 2px 8px;
  }
}

::v-deep .cv-day-number {
  display: none;
}

::v-deep .cv-day.today {
  background: $gray-lighter;
}
</style>
