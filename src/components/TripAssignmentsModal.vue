<template>
  <CUModal v-model="value" v-on="$listeners">
    <template #title>Assign Drivers and Vehicles</template>
  </CUModal>
</template>
<script lang="ts">
import { RequiredVehicleType, Trip, VehicleAssignment } from '@/models/dto'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { buildModel } from '@/utils/availability'
@Component({})
export default class TripAssignmentsModal extends Vue {
  @Prop({ required: true }) readonly requiredVehicles!: RequiredVehicleType
  @Prop({ required: true }) readonly requiredDrivers!: number
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]
  @Prop({ required: true }) readonly reservationId!: number
  @Prop({ required: true }) readonly value!: boolean


}
</script>
