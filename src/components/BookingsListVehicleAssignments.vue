<template>
  <div
    :class="{
      'w-full margin-t-3': $vuetify.breakpoint.xs,
    }"
  >
    <p v-if="needsAcceptance" class="font-medium text-red margin-t-0">
      Needs Acceptance
    </p>
    <VehicleAssignmentIcons
      :reservation="row"
      :enable-mobile-view="true"
      v-if="!needsAcceptance"
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

  isDialogOpen = false

  get needsAcceptance(): boolean {
    return this.row.referralStatus !== ReferralStatus.Accepted
  }
}
</script>
