<template>
  <v-row class="align-center justify-space-between">
    <v-col cols="6" md="auto" class="order-1">
      <div class="row align-center margin-a-0 justify-center">
        <CUIcon class="margin-r-2" color="gray-light">trip_type</CUIcon>
        {{ tripType }}
      </div>
    </v-col>
    <v-col cols="6" md="auto" class="order-3 order-md-2">
      <div class="row align-center margin-a-0 justify-center">
        <VehicleAssignmentIcons
          v-if="trip"
          :trip="trip"
          :vehicle-assignments="tripAssignments"
          show-label="true"
        />
      </div>
    </v-col>
    <v-col cols="6" md="auto" class="order-4 order-md-3">
      <div class="row align-center margin-a-0 justify-center">
        <DriverAssignmentIcons
          v-if="trip"
          :trip="trip"
          :vehicle-assignments="tripAssignments"
          show-label="true"
        />
      </div>
    </v-col>
    <v-col cols="6" md="auto" class="order-2 order-md-4">
      <div class="row align-center margin-a-0 justify-center">
        <CUIcon class="margin-r-2" color="gray-light">ticket</CUIcon>
        {{ passengerCount }} Passengers
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ReservationDetail, Trip, VehicleAssignment } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import DriverAssignmentIcons from '@/components/DriverAssignmentIcons.vue'

@Component({
  components: { VehicleAssignmentIcons, DriverAssignmentIcons },
})
export default class BookingDetailTripNumbers extends Vue {
  @Prop({ required: true }) readonly reservation?: ReservationDetail
  @Prop({ required: true }) readonly trip?: Trip
  @Prop({ required: true }) readonly tripAssignments?: VehicleAssignment[]

  get tripType(): string {
    return this.reservation?.tripType
  }

  get passengerCount(): string {
    return this.reservation?.referralPassengerCount
  }
}
</script>
