<template>
  <div
    :class="{
      'w-full margin-t-3': $vuetify.breakpoint.xs,
    }"
  >
    <VehicleAssignmentIcons
      :reservation="row"
      :enable-mobile-view="true"
      v-if="!needsAcceptance || !isMobile"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import { Reservation } from '@/models/dto'
import { ReferralStatus } from '@/utils/enum'

@Component({ components: { VehicleAssignmentIcons } })
export default class BookingsListVehicleAssignments extends Vue {
  @Prop({ required: false }) readonly row: Reservation
  @Prop({ required: false }) readonly isMobile: boolean

  isDialogOpen = false

  get needsAcceptance(): boolean {
    return this.row.referralStatus !== ReferralStatus.Accepted
  }
}
</script>
