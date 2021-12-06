<template>
  <v-card>
    <v-card-text class="padding-a-4">
      <p class="font-medium margin-t-0">
        Miami
        <span class="text-gray-light">></span>
        Orlando
      </p>
      <p class="font-14 margin-t-0">05/05/2021 &#8226; 3:30pm</p>
      <p>ICONS</p>
      <v-row>
        <p class="col shrink white-space-nowrap font-bold font-18">$6,150</p>
        <v-spacer />
        <p class="col shrink white-space-nowrap font-bold font-12 text-error">
          Needs Assignment
        </p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Reservation } from '@/models/dto'

@Component
export default class BookingCard extends Vue {
  @Prop() readonly reservation!: Reservation
}
</script>
