<template>
  <div>
    <div class="row align-center margin-t-0 margin-x-0 margin-b-3">
      <CUIcon class="margin-r-2" color="gray-mid-light">trip_type</CUIcon>
      {{ tripType }}
    </div>
    <div class="row align-center margin-t-0 margin-x-0 margin-b-3">
      <CUIcon class="margin-r-2" color="gray-mid-light">directions_bus</CUIcon>
      <span
        v-for="(requiredVehicle, requiredVehicleIndex) in requiredVehicles"
        :key="`required-vehicle-${requiredVehicle.vehicleType}-${requiredVehicleIndex}`"
      >
        {{ formattedRequiredVehicle(requiredVehicle) }}
      </span>
    </div>
    <div class="row align-center margin-t-0 margin-x-0 margin-b-3">
      <CUIcon class="text-gray-mid-light margin-r-2">person</CUIcon>
      {{ formattedRequiredDrivers }}
    </div>
    <div class="row align-center margin-a-0">
      <CUIcon class="margin-r-2" color="gray-mid-light">ticket</CUIcon>
      {{ passengerCount }} Passengers
    </div>
  </div>
</template>

<script lang="ts">
import { Vehicle } from '@/models/dto'
import bidDetail from '@/store/modules/bidDetail'
import { pluralize } from '@/utils/string'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailTripNumbers extends Vue {
  get tripType(): string {
    return bidDetail.getTrip?.tripType.label
  }

  get passengerCount(): number {
    return bidDetail.getTrip?.passengerCount
  }

  get formattedRequiredDrivers(): string {
    return `${bidDetail.getTrip?.requiredDrivers} ${pluralize(
      bidDetail.getTrip?.requiredDrivers,
      'Driver'
    )}`
  }

  get requiredVehicles(): Vehicle[] {
    return bidDetail.getTrip?.vehicles
  }

  formattedRequiredVehicle(vehicle: Vehicle): string {
    return `${vehicle.quantity} ${pluralize(
      vehicle.quantity,
      vehicle.vehicleType.label
    )}`
  }
}
</script>
