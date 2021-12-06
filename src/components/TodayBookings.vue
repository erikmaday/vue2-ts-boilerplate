<template>
  <v-container>
    <v-row>
      <h3
        class="col shrink white-space-nowrap font-book font-weight-400 font-20"
      >
        Your Bookings
      </h3>
      <v-spacer />
      <p
        class="
          col
          shrink
          white-space-nowrap
          text-primary
          font-14 font-medium
          text-decoration-underline
          cursor-pointer
        "
      >
        All Your Bookings (30)
      </p>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-chip
          v-for="(filter, filterIndex) in bookingFilters"
          :color="filter.active ? 'primary' : 'gray-border'"
          :text-color="filter.active ? 'primary' : 'black'"
          outlined
          class="margin-r-2 cursor-pointer margin-b-2"
          :key="`booking-filter-${filterIndex}`"
          @click="filter.active = !filter.active"
        >
          {{ filter.label }} ({{ filter.count }})
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(reservation, reservationIndex) in 6"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        :key="`reservation-${reservationIndex}`"
      >
        <BookingCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BookingCard from '@/components/BookingCard.vue'

@Component({
  components: {
    BookingCard,
  },
})
export default class TodayBookings extends Vue {
  bookingFilters = [
    {
      label: 'Starting Soon',
      count: 4,
      value: null,
      active: false,
    },
    {
      label: 'Needs Acceptance',
      count: 1,
      value: null,
      active: false,
    },
    {
      label: 'Needs Assignment',
      count: 1,
      value: null,
      active: false,
    },
    {
      label: 'In Progress',
      count: 2,
      value: null,
      active: false,
    },
    {
      label: 'Finished',
      count: 1,
      value: null,
      active: false,
    },
  ]
}
</script>
