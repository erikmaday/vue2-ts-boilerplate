<template>
  <v-card
    class="
      border
      w-full
      cursor-pointer
      hover:shadow-primary-xl hover:border-white
    "
    @mouseenter="isActive = true"
    @focus="isActive = true"
    @mouseleave="isActive = false"
    @blur="isActive = false"
  >
    <v-card-text>
      <p
        v-if="actionMessage"
        class="font-12 margin-b-4 font-medium"
        :class="`text-${actionMessage.color}`"
      >
        {{ actionMessage.text }}
      </p>
      <p class="font-medium">
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
      <div class="d-flex align-center margin-t-6 margin-b-2">
        <!-- <span class="font-bold font-20">$9,200</span> -->
        <v-spacer />
        <!-- <span v-if="isActive" class="text-primary font-bold">View</span> -->
        <CUIcon class="text-primary margin-l-2">arrow_right</CUIcon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { ColoredMessage } from '@/models/ColoredMessage'
import { RequiredVehicle, Stop, Trip } from '@/models/dto'

import CUIcon from '@/components/CUIcon.vue'
import { pluralize } from '@/utils/string'
import { timeDifferenceToObject, timeObjectToString } from '@/utils/time'

@Component({
  components: {
    CUIcon,
  },
})
export default class MarketplaceCard extends Vue {
  @Prop() readonly trip!: Trip

  isActive = false

  get actionMessage(): ColoredMessage {
    dayjs.extend(utc)

    const now = dayjs.utc()
    const expiration = dayjs(this.trip.biddingEndDate)
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
    const datetime = dayjs(
      this.firstPickup.pickupDate,
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
}
</script>
