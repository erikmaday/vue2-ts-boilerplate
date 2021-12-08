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
        {{ pickupLocation }}
        <span class="text-gray-light">></span>
        {{ dropoffLocation }}
      </p>
      <p class="font-14 margin-t-0 margin-b-3">
        {{ formattedStartDateTime }}
      </p>
      <div class="d-flex align-center">
        <CUIcon class="text-gray-mid-light margin-r-2">directions_bus</CUIcon>
        <span class="font-14">1 Charter Bus</span>
      </div>
      <div class="d-flex align-center">
        <CUIcon class="text-gray-mid-light margin-r-2">person</CUIcon>
        <span class="font-14">2 Drivers</span>
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

import { ColoredMessage } from '@/models/ColoredMessage'
import { Vehicle, Trip } from '@/models/dto'

import CUIcon from '@/components/CUIcon.vue'

@Component({
  components: {
    CUIcon,
  },
})
export default class MarketplaceCard extends Vue {
  @Prop() readonly trip!: Trip

  isActive = false

  get actionMessage(): ColoredMessage {
    return {
      text: 'Expires in 1d 2h 46m',
      color: 'gray-light',
    }
  }

  get pickupLocation(): string {
    return 'Dallas'
  }

  get dropoffLocation(): string {
    return 'Houston'
  }

  get formattedStartDateTime(): string {
    const firstStop = this.trip.stops[0]
    const datetime = dayjs(firstStop.pickupDate, firstStop.address.timeZone)
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  get requiredVehicles(): Array<Vehicle> {
    const veh1 = {
      tripVehicleId: 123,
      tripId: 123124,
      vehicleTypeId: 1,
      quantity: 2,
      vehicleType: {
        id: 1,
        key: 'charter_bus',
        label: 'Charter Bus',
      },
      vehicleTypeKey: 'charter_bus',
    }
    const veh2 = {
      tripVehicleId: 1234,
      tripId: 231412,
      vehicleTypeId: 2,
      quantity: 1,
      vehicleType: {
        id: 2,
        key: 'mini_bus',
        label: 'Mini Bus',
      },
      vehicleTypeKey: 'mini_bus',
    }
    return [veh1, veh2]
  }
}
</script>
