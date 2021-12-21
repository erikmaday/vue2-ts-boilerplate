<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BookingDetailStepTimeline
          :reservation="reservation"
          :trip-assignments="tripAssignments"
        />
      </v-col>
      <v-col cols="12">
        <BookingDetailHeader
          :reservation="reservation"
          :trip-assignments="tripAssignments"
          @refresh="refresh"
        />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12" class="margin-b-0">
        <BookingDetailTripNumbers
          :reservation="reservation"
          :trip="trip"
          :trip-assignments="tripAssignments"
        />
      </v-col>

      <v-col cols="12">
        <BookingDetailMap v-if="reservation" :reservation="reservation" />
      </v-col>
      <v-col cols="12">
        <BookingDetailItinerary v-if="reservation" :reservation="reservation" />
      </v-col>
      <v-col cols="12">
        <BookingDetailCustomerNotes :reservation="reservation" />
      </v-col>
      <template v-if="isAccepted">
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <BookingDetailPaymentStatus :reservation="reservation" />
        </v-col>
      </template>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12">
        <BookingDetailComments :reservation="reservation" @refresh="refresh" />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12">
        <BookingDetailCustomerInformation :reservation="reservation" />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12"><BookingDetailSupport /></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ReservationDetail, Trip, VehicleAssignment } from '@/models/dto'
import { Component, Vue } from 'vue-property-decorator'
import BookingDetailStepTimeline from '@/components/BookingDetailStepTimeline.vue'
import BookingDetailHeader from '@/components/BookingDetailHeader.vue'
import BookingDetailTripNumbers from '@/components/BookingDetailTripNumbers.vue'
import BookingDetailSupport from '@/components/BookingDetailSupport.vue'
import BookingDetailMap from '@/components/BookingDetailMap.vue'
import BookingDetailItinerary from '@/components/BookingDetailItinerary.vue'
import BookingDetailPaymentStatus from '@/components/BookingDetailPaymentStatus.vue'
import BookingDetailCustomerNotes from '@/components/BookingDetailCustomerNotes.vue'
import BookingDetailCustomerInformation from '@/components/BookingDetailCustomerInformation.vue'
import BookingDetailComments from '@/components/BookingDetailComments.vue'
import reservation from '@/services/reservation'
import tripAssignments from '@/services/tripAssignment'
import trip from '@/services/trip'
import { ReferralStatus } from '@/utils/enum'

@Component({
  components: {
    BookingDetailStepTimeline,
    BookingDetailHeader,
    BookingDetailTripNumbers,
    BookingDetailSupport,
    BookingDetailPaymentStatus,
    BookingDetailCustomerInformation,
    BookingDetailComments,
    BookingDetailCustomerNotes,
    BookingDetailMap,
    BookingDetailItinerary,
  },
})
export default class BookingDetail extends Vue {
  id: number | null = null
  reservation: ReservationDetail | null = null
  trip: Trip | null = null
  tripAssignments: VehicleAssignment[] = []

  created(): void {
    this.id = parseInt(this.$route.params.id)
  }

  mounted(): void {
    this.refresh()
  }

  async refresh(): Promise<void> {
    await this.getReservation()
    this.getTripAssignments()
    this.getTrip()
  }

  async getReservation(): Promise<void> {
    if (this.id) {
      const reservationResponse = await reservation.byId(this.id)
      if (
        reservationResponse.data?.referralStatus === ReferralStatus.Rejected
      ) {
        //FOR NOW, REDIRECT HOME
        this.$router.push({ name: 'home' })
        return
      }
      this.reservation = reservationResponse.data
    }
  }

  get isAccepted(): boolean {
    return this.reservation?.referralStatus === ReferralStatus.Accepted
  }

  async getTrip(): Promise<void> {
    if (this.reservation?.tripId) {
      const tripResponse = await trip.byId(this.reservation.tripId)
      this.trip = tripResponse.data.trip
    }
  }

  async getTripAssignments(): Promise<void> {
    if (this.id) {
      const tripAssignmentsResponse = await tripAssignments.byReservationIds([
        this.id,
      ])
      this.tripAssignments = tripAssignmentsResponse.data.vehicleAssignments
    }
  }
}
</script>
