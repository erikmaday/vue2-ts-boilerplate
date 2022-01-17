<template>
  <router-link :to="bookingRoute">
    <v-card class="border-radius-2x" @click="() => ({})">
      <v-card-text class="padding-a-4">
        <p class="font-medium margin-t-0">
          {{ waypointCities.pickup }}
          <span class="text-gray-light">></span>
          {{ waypointCities.dropoff }}
        </p>
        <p class="font-14 margin-t-0">{{ formattedStartDateTime }}</p>
        <div class="d-inline-flex margin-t-4 margin-b-2">
          <div class="margin-r-4 h-32">
            <VehicleAssignmentIcons
              v-if="reservation"
              :reservation="reservation"
            />
          </div>
          <DriverAssignmentIcons :reservation="reservation" />
        </div>
        <v-row class="align-end">
          <p class="col shrink white-space-nowrap font-bold font-18">
            {{ price }}
          </p>
          <v-spacer v-if="actionMessage" />
          <p
            v-if="actionMessage"
            class="col shrink white-space-nowrap font-bold font-12 text-error"
          >
            {{ actionMessage }}
          </p>
        </v-row>
      </v-card-text>
    </v-card>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import DriverAssignmentIcons from '@/components/DriverAssignmentIcons.vue'
import { Reservation } from '@/models/dto'
import { ReferralStatus } from '@/utils/enum'
import {
  getReservationPickupDestinationCities,
  roundedCurrencyFilter,
} from '@/utils/string'
import { RawLocation } from 'vue-router'

@Component({
  components: {
    VehicleAssignmentIcons,
    DriverAssignmentIcons,
  },
})
export default class BookingCard extends Vue {
  @Prop() readonly reservation!: Reservation

  get needsAssignment(): boolean {
    return (
      this.reservation.assignedDriverPercentage < 100 ||
      this.reservation.assignedVehiclePercentage < 100
    )
  }

  get needsAcceptance(): boolean {
    return this.reservation?.referralStatus === ReferralStatus.Offered
  }

  get actionMessage(): string | null {
    if (this.needsAcceptance) {
      return 'Needs Acceptance'
    }
    if (this.needsAssignment) {
      return 'Needs Assignment'
    }
    return null
  }

  get formattedStartDateTime(): string {
    if (!this.reservation.pickupDate) {
      return 'No Pickup Date Available'
    }
    const datetime = (this as any)
      .$dayjs(this.reservation.pickupDate)
      .tz(this.reservation.firstPickupTimeZone)
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  get price(): string {
    return roundedCurrencyFilter(this.reservation.customerTotal)
  }

  get waypointCities(): { pickup: string; dropoff: string } {
    return getReservationPickupDestinationCities(this.reservation)
  }

  get bookingRoute(): RawLocation {
    return {
      name: 'booking-detail',
      params: { id: this.reservation.reservationId.toString() },
    }
  }
}
</script>
