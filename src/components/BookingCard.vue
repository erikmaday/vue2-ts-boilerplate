<template>
  <v-card>
    <v-card-text class="padding-a-4">
      <p class="font-medium margin-t-0">
        {{ reservation.firstPickupAddress.city }}
        <span class="text-gray-light">></span>
        {{ reservation.firstDropoffAddress.city }}
      </p>
      <p class="font-14 margin-t-0">{{ formattedStartDateTime }}</p>
      <p>ICONS</p>
      <!-- TODO: CREATE NEW COMPONENT TO HANDLE THESE ICONS -->
      <v-row class="align-end">
        <p class="col shrink white-space-nowrap font-bold font-18">$6,150</p>
        <!-- TODO: FIGURE OUT HOW WE CAN SURFACE THIS AMOUNT -->
        <v-spacer v-if="needsAssignment" />
        <p
          v-if="needsAssignment"
          class="col shrink white-space-nowrap font-bold font-12 text-error"
        >
          Needs Assignment
        </p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Reservation } from '@/models/dto'
import dayjs from 'dayjs'

@Component
export default class BookingCard extends Vue {
  @Prop() readonly reservation!: Reservation

  get needsAssignment(): boolean {
    return !(
      this.reservation.assignedDriverPercentage &&
      this.reservation.assignedVehiclePercentage
    )
  }

  get formattedStartDateTime(): string {
    const datetime = dayjs(
      this.reservation.startDate,
      this.reservation.firstStopAddressTimeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }
}
</script>
