<template>
  <v-row>
    <v-col cols="12">
      <h3 class="font-18 white-space-nowrap">Customer Information</h3>
    </v-col>
    <v-col
      cols="12"
      md="auto"
      :class="{ 'padding-b-0': $vuetify.breakpoint.smAndDown }"
    >
      <v-row>
        <v-col cols="auto">
          <img
            :src="customerImage"
            class="border-radius-round max-h-88 max-w-88"
            width="auto"
            height="auto"
          />
        </v-col>
        <v-col cols="auto">
          <p class="font-16 font-medium">
            {{ name }}
          </p>
          <v-btn
            text
            small
            color="primary"
            class="font-16 font-medium padding-x-0"
          >
            Send Message
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="auto">
      <v-row>
        <v-col cols="auto">
          <p class="font-16 text-gray-mid-light">Email</p>
          <p class="font-medium">{{ email }}</p>
        </v-col>
        <v-col cols="auto">
          <p class="font-16 text-gray-mid-light">Phone</p>
          <p class="font-medium">{{ phone }}</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ReservationDetail } from '@/models/dto'
import { phoneFormatFilter } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BookingDetailCustomerInformation extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

  get customerImage(): string {
    const customerImage = 'https://picsum.photos/100/100'
    return customerImage
  }

  get name(): string | null {
    return this.reservation?.customerName || null
  }

  get email(): string | null {
    return this.reservation?.customerEmail || null
  }

  get phone(): string | null {
    if (this.reservation?.customerPhoneNumber) {
      return phoneFormatFilter(this.reservation?.customerPhoneNumber)
    }
    return null
  }
}
</script>
