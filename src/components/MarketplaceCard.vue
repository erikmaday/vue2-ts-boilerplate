<template>
  <v-card
    class="
      border
      w-full
      cursor-pointer
      hover:shadow-primary-xl hover:border-white
      border-radius-2x
    "
    @mouseenter="isActive = true"
    @focus="isActive = true"
    @mouseleave="isActive = false"
    @blur="isActive = false"
    @click="goToBid"
  >
    <v-card-text class="padding-a-4">
      <p class="font-medium margin-t-0">
        {{ firstPickup.address.city }}
        <span class="text-gray-light">></span>
        {{ firstDropoff.address.city }}
      </p>
      <p class="font-14 margin-t-0 margin-b-3">
        {{ formattedStartDateTime }}
      </p>
      <div class="d-flex align-center">
        <CUIcon class="text-gray-mid-light margin-r-2">directions_bus</CUIcon>
        <span
          v-for="(requiredVehicle, requiredVehicleIndex) in requiredVehicles"
          :key="`required-vehicle-${requiredVehicle.vehicleType}-${requiredVehicleIndex}`"
          class="font-14"
        >
          {{ formattedRequiredVehicle(requiredVehicle) }}
        </span>
      </div>
      <div class="d-flex align-center">
        <CUIcon class="text-gray-mid-light margin-r-2">person</CUIcon>
        <span class="font-14">{{ formattedRequiredDrivers }}</span>
      </div>
      <div class="d-flex justify-end">
        <span
          v-if="actionMessage"
          class="white-space-nowrap font-bold font-12 text-error"
          :class="`text-${actionMessage.color}`"
        >
          {{ actionMessage.text }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { ColoredMessage } from '@/models/ColoredMessage'
import { RequiredVehicle, Stop, Trip } from '@/models/dto'

import { pluralize } from '@/utils/string'
import { timeDifferenceToObject, timeObjectToString } from '@/utils/time'

@Component
export default class MarketplaceCard extends Vue {
  @Prop() readonly trip!: Trip

  isActive = false

  get actionMessage(): ColoredMessage {
    const now = this.$dayjs.utc()
    const expiration = this.$dayjs(this.trip.biddingEndDate)
    const diff = timeDifferenceToObject(now, expiration)

    return {
      text: `Expires in ${timeObjectToString(diff)}`,
      color: diff.days <= 0 ? 'error' : 'gray-light',
    }
  }

  get firstPickup(): Stop {
    return this.trip.stops[0]
  }

  get firstDropoff(): Stop {
    return this.trip.stops?.[1] || this.firstPickup
  }

  get formattedStartDateTime(): string {
    const datetime = this.$dayjs(this.firstPickup.pickupDate).tz(
      this.firstPickup.address.timeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  get requiredVehicles(): RequiredVehicle[] {
    return this.trip.requiredVehicles || []
  }

  get formattedRequiredDrivers(): string {
    return `${this.trip.requiredDrivers} ${pluralize(
      this.trip.requiredDrivers,
      'Driver'
    )}`
  }

  formattedRequiredVehicle(vehicle: RequiredVehicle): string {
    return `${vehicle.requiredVehicles} ${pluralize(
      vehicle.requiredVehicles,
      vehicle.vehicleType
    )}`
  }

  goToBid(): void {
    this.$router.push({
      name: 'bid-detail',
      params: { id: this.trip.tripId },
    })
  }
}
</script>
