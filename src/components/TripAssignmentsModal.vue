<template>
  <CUModal v-model="value" v-on="$listeners">
    <template #title>Assign Drivers and Vehicles</template>
    <template #text>
      <div
        v-for="(assignment, i) in model"
        :key="`assignment-group-${i}`"
      >

      </div>
    </template>
  </CUModal>
</template>
<script lang="ts">
import { RequiredVehicleType, Trip, Vehicle, VehicleAssignment } from '@/models/dto'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { buildModel } from '@/utils/availability'
import { Driver } from '@/models/dto/Driver'
@Component({})
export default class TripAssignmentsModal extends Vue {
  @Prop({ required: true }) readonly requiredVehicles!: RequiredVehicleType[]
  @Prop({ required: true }) readonly requiredDrivers!: number
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]
  @Prop({ required: true }) readonly reservationId!: number
  @Prop({ required: true }) readonly value!: boolean

  model: any = []
  vehicles: Vehicle[] = []
  drivers: Driver[] = []

  mounted(): void {
    this.model = buildModel(
      this.tripAssignments,
      this.requiredVehicles,
      this.requiredDrivers
    )
  }
}
</script>
