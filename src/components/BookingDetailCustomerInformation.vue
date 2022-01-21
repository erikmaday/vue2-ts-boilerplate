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
          <CUSkeletonLoader
            v-if="loading"
            type="avatar"
            width="88px"
            height="88px"
          />
          <img
            v-else-if="customerImage"
            :src="customerImage"
            class="border-radius-round max-h-88 max-w-88"
            width="auto"
            height="auto"
          />
          <div
            v-else
            class="w-88 h-88 border-radius-round border-solid border-2 border-gray-border d-flex align-center justify-center background-gray-header"
          >
            <CUIcon
              color="gray-mid-light"
              width="64px"
              height="64px"
              class="margin-t-n1"
            >
              person
            </CUIcon>
          </div>
        </v-col>
        <v-col cols="auto">
          <CUSkeletonLoader
            v-if="loading"
            width="80px"
            type="text"
            classes="margin-t-3"
          />
          <p v-else class="font-16 font-medium">
            {{ name }}
          </p>
          <CUSkeletonLoader
            v-if="loading"
            type="text"
            width="110px"
            classes="margin-t-3"
          />
          <button
            v-else
            class="font-16 text-primary font-medium padding-x-0 margin-t-2"
            @click="emailCustomer"
          >
            Send Message
          </button>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="auto">
      <v-row>
        <v-col cols="auto">
          <CUSkeletonLoader
            v-if="loading"
            type="text"
            width="80px"
            classes="margin-t-3"
          />
          <p v-else class="font-16 text-gray-mid-light">Email</p>
          <CUSkeletonLoader
            v-if="loading"
            type="text"
            width="200px"
            classes="margin-t-3"
          />
          <p v-else class="font-medium">{{ email }}</p>
        </v-col>
        <v-col cols="auto">
          <CUSkeletonLoader
            v-if="loading"
            width="80px"
            type="text"
            classes="margin-t-3"
          />
          <p v-else class="font-16 text-gray-mid-light">Phone</p>
          <CUSkeletonLoader
            v-if="loading"
            width="150px"
            type="text"
            classes="margin-t-3"
          />
          <p v-else class="font-medium">{{ phone }}</p>
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
  @Prop({ required: true }) readonly loading!: boolean

  get customerImage(): string {
    const customerImage = ''
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
  emailCustomer(): void {
    document.location.href = `mailto:${this.email}`
  }
}
</script>
