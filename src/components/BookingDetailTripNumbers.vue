<template>
  <v-row class="align-center justify-space-between">
    <v-col cols="6" md="auto" class="order-1">
      <div class="row align-center margin-a-0 justify-center">
        <div v-if="loading" class="d-inline-flex">
          <CUSkeletonLoader type="icon" classes="margin-r-2" />
          <CUSkeletonLoader height="24px" width="100px" />
        </div>
        <template v-else>
          <CUIcon class="margin-r-2" color="gray-light">trip_type</CUIcon>
          {{ tripType }}
        </template>
      </div>
    </v-col>
    <v-col cols="6" md="auto" class="order-3 order-md-2">
      <div class="row align-center margin-a-0 justify-center">
        <TripAssignmentIconsSkeletonLoader
          v-if="loading"
          show-label
          style="margin-bottom: -1px"
        />
        <VehicleAssignmentIcons
          v-else-if="trip && reservation"
          :reservation="reservation"
          :trip="trip"
          :vehicle-assignments="tripAssignments"
          show-label="true"
        />
      </div>
    </v-col>
    <v-col cols="6" md="auto" class="order-4 order-md-3">
      <div class="row align-center margin-a-0 justify-center">
        <TripAssignmentIconsSkeletonLoader
          v-if="loading"
          show-label
          style="margin-bottom: -1px"
        />
        <DriverAssignmentIcons
          v-else-if="trip && reservation"
          :reservation="reservation"
          :trip="trip"
          :vehicle-assignments="tripAssignments"
          show-label="true"
        />
      </div>
    </v-col>
    <v-col cols="6" md="auto" class="order-2 order-md-4">
      <div class="row align-center margin-a-0 justify-center">
        <div v-if="loading" class="d-inline-flex">
          <CUSkeletonLoader type="icon" classes="margin-r-2" />
          <CUSkeletonLoader height="24px" width="100px" />
        </div>
        <template v-else>
          <CUIcon class="margin-r-2" color="gray-light">ticket</CUIcon>
          {{ passengerCount }} Passengers
        </template>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ReservationDetail, Trip, VehicleAssignment } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import DriverAssignmentIcons from '@/components/DriverAssignmentIcons.vue'
import TripAssignmentsModal from '@/components/TripAssignmentsModal.vue'
import TripAssignmentIconsSkeletonLoader from '@/components/TripAssignmentIconsSkeletonLoader.vue'

@Component({
  components: {
    VehicleAssignmentIcons,
    DriverAssignmentIcons,
    TripAssignmentsModal,
    TripAssignmentIconsSkeletonLoader,
  },
})
export default class BookingDetailTripNumbers extends Vue {
  @Prop({ required: true }) readonly loading!: boolean
  @Prop({ required: true }) readonly reservation?: ReservationDetail
  @Prop({ required: true }) readonly trip?: Trip
  @Prop({ required: true }) readonly tripAssignments?: VehicleAssignment[]

  get tripType(): string {
    return this.reservation?.tripType
  }

  get passengerCount(): number {
    return this.reservation?.referralPassengerCount
  }
}
</script>
