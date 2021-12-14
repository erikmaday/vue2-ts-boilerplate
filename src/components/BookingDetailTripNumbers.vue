<template>
  <v-row>
    <v-col>{{ tripTypeLabel }}</v-col>
    <v-col>
      Vehicle Assignments
      <VehicleAssignmentIcons
        :trip="trip"
        :vehicle-assignments="tripAssignments"
      />
    </v-col>
    <v-col>
      Driver Assignments
      <DriverAssignmentIcons
        :trip="trip"
        :vehicle-assignments="tripAssignments"
      />
    </v-col>
    <v-col>Passenger Count</v-col>
  </v-row>
</template>

<script lang="ts">
import { Trip, VehicleAssignment } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import DriverAssignmentIcons from '@/components/DriverAssignmentIcons.vue'

@Component({ components: { VehicleAssignmentIcons, DriverAssignmentIcons } })
export default class BookingDetailTripNumbers extends Vue {
  // @Prop({ required: true }) readonly reservation!: Reservation
  @Prop({ required: true }) readonly trip!: Trip
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]

  get tripTypeLabel(): string {
    return this.trip?.tripType?.label
  }
}
</script>
