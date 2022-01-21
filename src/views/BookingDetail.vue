<template>
  <Main>
    <v-switch v-model="loading" />
    <v-row>
      <v-col cols="12">
        <BookingDetailStepTimeline
          :reservation="reservation"
          :trip-assignments="tripAssignments"
          :loading="showLoaders"
        />
      </v-col>
      <v-col cols="12">
        <BookingDetailHeader
          :reservation="reservation"
          :trip-assignments="tripAssignments"
          :loading="showLoaders"
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
          :loading="showLoaders"
          @refresh="refresh"
        />
      </v-col>

      <v-col cols="12">
        <CUSkeletonLoader
          v-if="showLoaders"
          classes="border-radius-none"
          height="280px"
        />
        <BookingDetailMap v-else :reservation="reservation" />
      </v-col>
      <v-col cols="12">
        <BookingDetailItinerary v-if="reservation" :reservation="reservation" />
      </v-col>
      <v-col cols="12" v-if="reservation && reservation.customerNotes">
        <BookingDetailCustomerNotes :reservation="reservation" />
      </v-col>
      <template v-if="isAccepted">
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12">
          <BookingDetailPaymentStatus
            :reservation="reservation"
            :loading="showLoaders"
          />
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
        <BookingDetailCustomerInformation
          :reservation="reservation"
          :loading="showLoaders"
        />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12"><BookingDetailSupport /></v-col>
    </v-row>
  </Main>
</template>

<script lang="ts">
import { ReservationDetail, Trip, VehicleAssignment } from '@/models/dto'
import { Component, Vue, Watch } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
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
import { EventBus } from '@/utils/eventBus'
import app from '@/store/modules/app'

@Component({
  components: {
    Main,
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
  loading = false

  @Watch('id', { immediate: true })
  valueChanged(): void {
    if (this.id) {
      this.refresh()
    }
  }

  get isAccepted(): boolean {
    return this.reservation?.referralStatus === ReferralStatus.Accepted
  }

  get showLoaders(): boolean {
    return this.loading && app.areLoadersEnabled
  }

  created(): void {
    this.loading = true
    this.id = parseInt(this.$route.params.id)
  }

  mounted(): void {
    this.refresh()
    EventBus.$on('refresh-assignments', () => this.refresh())
  }

  async refresh(): Promise<void> {
    this.loading = true
    await this.getReservation()
    this.getTripAssignments()
    this.getTrip()
    this.loading = false
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
      if (!reservationResponse.data?.reservationId) {
        const res = await reservation.getActiveReferral(this.id)
        if (res.data?.reservationId) {
          this.id = res.data.reservationId
        }
      } else {
        this.reservation = reservationResponse.data
      }
    }
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
